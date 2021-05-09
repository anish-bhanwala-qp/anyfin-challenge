interface Props {
  message: string;
}

export const ErrorMessage = ({ message }: Props) => {
  return <p data-testid="error-message">{message}</p>;
};
