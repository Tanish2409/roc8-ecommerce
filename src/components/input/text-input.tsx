import cn from "@/utils/class-names";
import { TextInput, type TextInputProps } from "@mantine/core";

type Props = TextInputProps;

const StyledTextInput: React.FC<Props> = ({ error, ...rest }) => {
  return (
    <TextInput
      error={error}
      classNames={{
        root: "w-full",
        label: "text-base mb-2",
        input: cn(
          "border rounded-md placeholder:text-placeholder p-4 w-full",
          error ? "border-red-500" : "border-border-light",
        ),
        error: "text-red-500",
      }}
      {...rest}
    />
  );
};

export { StyledTextInput };
