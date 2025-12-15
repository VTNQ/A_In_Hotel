
import { getAllHotel } from "@/service/api/Hotel";
import type { HotelRow } from "@/type/hotel.types";
import { useEffect, useState } from "react";

export function useHotelList(
    page: number,
    pageSize: number,
    search: string
) {
    const[rows, setRows] = useState<HotelRow[]>([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);

    const fetchHotels = async()=>{
        try{
            setLoading(true);
            const res = await getAllHotel({
                page,
                size:pageSize,
                searchValue:search
            });
            const list: HotelRow[] = (res?.data?.content || []).map((item: any) => ({
                id: item.id,
                code: item.code,
                name: item.name,
                createdOn: item.createdAt,
                status: Number(item.status),
                address: item.address || "Chưa cập nhật",
                fullName: item.fullName || "Chưa cập nhật",
                idUser: item.idUser,
              }));
              setRows(list);
        }catch(e:any){
            setError(e?.message || "Không thể tải dữ liệu");
            setRows([]);
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchHotels();
    },[page,pageSize,search]);
    return { rows,loading,error, refetch: fetchHotels }
}