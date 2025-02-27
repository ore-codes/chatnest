import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import {
  GetJoinedRooms,
  GetRoomByName,
  JoinRoomMutation,
} from "@/lib/chat/chat.gql";
import { chatService } from "@/lib/chat/ChatService";
import Textbox from "@/components/textbox";
import FormError from "@/components/form-error";
import Button from "@/components/button";

const JoinRoomForm: FC<{ onClose: () => void }> = (props) => {
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm({
    resolver: yupResolver(
      Yup.object({
        name: Yup.string().required().label("Room name"),
      }).required(),
    ),
  });

  const [joinRoomFn, joinRoomMutation] = useMutation(JoinRoomMutation, {
    refetchQueries: [GetJoinedRooms],
    async onCompleted(data) {
      chatService.activeRoom.setData(data.joinRoom);
    },
    onError: console.error,
  });

  const [getRoomByName, roomQuery] = useLazyQuery(GetRoomByName);

  const handleSubmit = form.handleSubmit(async () => {
    const { data } = await getRoomByName({ variables: form.getValues() });

    if (data.getRoom || isCreating) {
      await joinRoomFn({ variables: form.getValues() });
      props.onClose();
    } else {
      setIsCreating(true);
    }
  });

  const mutationError = useMemo(() => {
    return [roomQuery.error, joinRoomMutation.error].find(
      (e) => e instanceof ApolloError,
    );
  }, [roomQuery.error, joinRoomMutation.error]);

  const mutationLoading = useMemo(() => {
    return roomQuery.loading || joinRoomMutation.loading;
  }, [roomQuery.loading, joinRoomMutation.loading]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold">Join chat</h1>
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor="name">
          Room name
        </label>
        <small className="-mt-2 text-placeholder">
          If it does not exist, we will create one
        </small>
        <Textbox
          id="name"
          placeholder="Enter room name"
          {...form.register("name")}
        />
        <FormError message={form.formState.errors.name?.message} />
      </div>
      {mutationError !== undefined && (
        <div className="rounded-md border border-danger bg-danger/20 p-2 text-sm capitalize text-danger">
          {mutationError.message}
        </div>
      )}
      {isCreating && (
        <div className="rounded-md border border-warning bg-warning/20 p-2 text-sm capitalize text-warning">
          There is no room found with that name. Click the button below to
          create a new room or change the room name above.
        </div>
      )}
      <Button type="submit" disabled={mutationLoading}>
        Create / Join
      </Button>
    </form>
  );
};

export default JoinRoomForm;
