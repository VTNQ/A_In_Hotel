const PriceInfo = ({ label, value }: any) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-semibold">
      {Number(value || 0).toLocaleString("vi-VN")} VND
    </span>
  </div>
);
export default PriceInfo;