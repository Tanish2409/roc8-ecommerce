import OtpInput, { type OTPInputProps } from "react-otp-input";

type Props = Pick<OTPInputProps, "value" | "onChange">;

const StyledOTPInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <p className="mb-2 text-base">Code</p>
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={8}
        renderInput={(props) => (
          <input
            {...props}
            className="!h-12 !w-12 rounded-md border border-border-light"
          />
        )}
        containerStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      />
    </>
  );
};

export { StyledOTPInput };
