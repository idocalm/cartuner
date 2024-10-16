import { Progress } from "~/components/ui/progress";
import { useEffect, useState } from "react";

const Loading: React.FC<{ message: string; title: string }> = ({
  message,
  title,
}) => {
  /* animate and interpolate the progress bar */

  const [progress, setProgress] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 10) % 100);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Progress className="w-1/3" value={progress} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
};

export default Loading;
