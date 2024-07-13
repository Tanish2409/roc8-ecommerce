import cn from "@/utils/class-names";
import { PasswordInput, type PasswordInputProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = PasswordInputProps;

const StyledPasswordInput: React.FC<Props> = ({ error, ...rest }) => {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <PasswordInput
      classNames={{
        root: "w-full relative",
        label: "text-base mb-2",
        wrapper: cn(
          "flex w-full border rounded-md pr-[14px]",
          error ? "border-red-500" : "border-border-light",
        ),
        input: "grow",
        innerInput: cn("placeholder:text-placeholder outline-none p-4 w-full"),
        error: "text-red-500 h-full",
        section: "flex items-center justify-centerß underline text-base",
      }}
      error={error}
      visible={visible}
      onVisibilityChange={toggle}
      visibilityToggleIcon={({ reveal }) =>
        reveal ? <span>Hide</span> : <span>Show</span>
      }
      {...rest}
    />
  );
};

export { StyledPasswordInput };
