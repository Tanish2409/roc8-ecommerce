const VerityEmailTemplate = ({ name, otp }: { name: string; otp: string }) => {
  return (
    <div>
      <p>Hi, {name}</p>

      <br />

      <p>Here is the otp to verify your email: {otp}</p>
    </div>
  );
};

export { VerityEmailTemplate };
