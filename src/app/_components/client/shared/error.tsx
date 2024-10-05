const ErorrPanel: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="p-4 bg-red-100 text-red-800 rounded-md">
      <h1 className="text-3xl font-bold">An error occurred</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErorrPanel;
