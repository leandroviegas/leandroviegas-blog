import React, { createRef, useEffect } from "react";

interface Props {
  children?: React.ReactNode;
  closeCallback: () => void;
}

function OpaqueBackground({ closeCallback, children }: Props) {
  const opbgRef = createRef<HTMLDivElement>();

  function HandleBackgroundClick(event: MouseEvent) {
    if (event.target == opbgRef.current) {
      closeCallback();
    }
  }

  useEffect(() => {
    opbgRef.current?.addEventListener("mousedown", HandleBackgroundClick, true);

    return () => {
      opbgRef.current?.removeEventListener(
        "mousedown",
        HandleBackgroundClick,
        true
      );
    };
  }, [opbgRef]);

  return (
    <div
      ref={opbgRef}
      className={`fixed h-screen overflow-auto backdrop-blur-sm bg-black/60 blur-none opacity-100 transition duration-300 w-screen top-0 left-0 flex items-center justify-center z-30`}
    >
      {children}
    </div>
  );
}

export default OpaqueBackground;
