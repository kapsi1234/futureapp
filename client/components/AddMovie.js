import React from "react";
import {useForm} from "react-hook-form";

export default function AddMovie (props) 
{

    const {register, handleSubmit, errors} = useForm();
    const address = props.address;

    const onSubmit = (data) => {
        console.log(data);
        const req = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(address, req).then(res => res.json()).then(data => console.log(data));
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Nazwa filmu" {...register('title',{required: true})} />
                <input type="date"  {...register('release_date',{required: true})} />
                <input type="number" placeholder="ocena" max={5} min={1} {...register('rating',{required: true})} />
                <input type="text" placeholder="Imie i nazwiso reżysera" {...register('director',{required: true, pattern: {value: /^[A-Za-z]/i}})} />
                <input type="text" placeholder="Gatunek" {...register('genere',{required: true})} />
                <input type="submit"/>

            </form>
        </div>

    );
}