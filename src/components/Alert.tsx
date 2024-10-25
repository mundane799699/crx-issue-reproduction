export enum AlertType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

const classNames = (type: AlertType) => {
  switch (type) {
    case AlertType.INFO:
      return "bg-blue-50 text-blue-700";

    case AlertType.SUCCESS:
      return "bg-green-50 text-green-700";

    case AlertType.WARNING:
      return "bg-yellow-50 text-yellow-700";

    case AlertType.ERROR:
      return "bg-red-50 text-red-700";

    default:
      return "bg-blue-50 text-blue-700";
  }
};

export const Alert = (props) => {
  return (
    <div
      className={`flex rounded-lg items-center justify-center p-4 text-base ${classNames(
        props.type
      )}`}
      role="alert"
    >
      <div className="text-center">{props.message}</div>
    </div>
  );
};
