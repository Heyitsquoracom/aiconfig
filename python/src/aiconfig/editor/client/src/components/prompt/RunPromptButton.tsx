import { Button, Flex, Loader, Tooltip } from "@mantine/core";
import { IconPlayerPlayFilled, IconPlayerStop } from "@tabler/icons-react";
import { memo } from "react";

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
  const onClick = async () => {
    if (isRunning) {
      return await cancel();
    } else {
      return await runPrompt();
    }
  };
  const button = (
    <Button
      onClick={onClick}
      disabled={disabled}
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

  return !disabled ? (
    button
  ) : (
    <Tooltip label="Can't run while another prompt is running" withArrow>
      <div>{button}</div>
    </Tooltip>
  );
});
