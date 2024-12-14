import { socket } from "./use-socket";

enum AlertRecipient {
  CLIENT,
  CARTUNER_OWNER,
  CARTUNER_MECHANIC,
}

enum AlertType {
  FATAL_MESSAGE,
  INFO_MESSAGE,
  SUCCESS_MESSAGE,
  WARNING_MESSAGE,
  PURCHASED_MESSAGE,
}

interface Alert {
  message: string;
  props: any;
  type: AlertType;
  recipient: AlertRecipient;
}

function useAlert() {
  const alert = (alert: Alert) => {
    socket.emit("postAlert", alert);
  };
}

export { useAlert };
