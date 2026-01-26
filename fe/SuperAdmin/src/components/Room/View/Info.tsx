const Info = ({ label, value }: any) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value ?? "-"}</span>
  </div>
);
export default Info;