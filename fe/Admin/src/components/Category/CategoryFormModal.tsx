import { useState } from "react"

const CategoryFormModal =({
    isOpen,
    onClose,
    onSuccess,
}:CategoryFormModal)=>{
    const [formData,setFormData]=useState({
        name:"",
        type:""
    })
}