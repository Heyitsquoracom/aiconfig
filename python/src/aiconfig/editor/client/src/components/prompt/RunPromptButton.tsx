import { Button, Flex, Loader, Tooltip } from "@mantine/core";
import { IconPlayerPlayFilled, IconPlayerStop } from "@tabler/icons-react";
import { memo, useCallback, useContext, useEffect } from "react";
import AIConfigContext from "../../contexts/AIConfigContext";
import { run } from "node:test";

type Props = {
  cancel: () => Promise<void>;
  runPrompt: () => Promise<void>;
  isRunning?: boolean;
  disabled?: boolean;
};

export default memo(function RunPromptButton({
  cancel,
  runPrompt,
  isRunning = false,
  disabled = false,
}: Props) {
  const { readOnly } = useContext(AIConfigContext);
  const disabledOrReadOnly = disabled || readOnly;

  const onClick = useCallback(async () => {
    if (isRunning) {
      return await cancel();
    } else {
      return await runPrompt();
    }
  }, [runPrompt, cancel, isRunning]);

  // Override CTRL+ENTER to run prompt
  // useEffect(() => {
  //   const runHandler = (e: KeyboardEvent) => {
  //     // Note platform property to distinguish between CMD and CTRL for
  //     // Mac/Windows/Linux is deprecated.
  //     // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
  //     // Just handle both for now.
  //     if ((e.shiftKey || e.ctrlKey) && e.key === "Enter") {
  //       e.preventDefault();
  //       onClick();
  //     }
  //   };

  //   window.addEventListener("keydown", runHandler, false);

  //   return () => window.removeEventListener("keydown", runHandler);
  // }, [onClick]);

  const button = (
    <Button
      onClick={onClick}
      disabled={disabledOrReadOnly}
      p="xs"
      size="xs"
      className="runPromptButton"
    >
      {isRunning ? (
        <Flex align="center" justify="center">
          <Loader style={{ position: "absolute" }} size="xs" color="white" />
          <IconPlayerStop fill="white" size={14} />
        </Flex>
      ) : (
        <>
          <IconPlayerPlayFilled size="16" />
        </>
      )}
    </Button>
  );

  const disabledButton = readOnly ? (
    button
  ) : (
    <Tooltip label={"Can't run while another prompt is running"} withArrow>
      <div>{button}</div>
    </Tooltip>
  );

  return disabledOrReadOnly ? disabledButton : button;
});
