import { Icon } from "@iconify/react";
import {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useState,
} from "react";

export type ModalRef = {
  present: () => void;
  dismiss: () => void;
};

const Modal = forwardRef<ModalRef, PropsWithChildren>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => setIsVisible(true),
    dismiss: () => setIsVisible(false),
  }));

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-0 top-0 grid h-screen w-screen place-items-center bg-primary/20"
      onClick={() => setIsVisible(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative min-w-96 rounded-xl bg-white p-8 shadow-lg"
      >
        <Icon
          icon="mi:close"
          className="absolute right-8 top-8 size-8"
          onClick={() => setIsVisible(false)}
        />
        {props.children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
