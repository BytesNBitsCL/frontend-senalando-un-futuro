'use client'
import { Categoria } from '@/interfaces/categoriaInterface'
import React from 'react'

export default function ClientSideBg({category}: {category: Categoria | undefined}) {
    return (
        <>
            {/* Imagen de fondo */}
            <div 
                className='absolute inset-0 bg-cover bg-center w-full h-full -z-10' 
                style={{ backgroundImage: `url(${category?.bgCategoria})` }}
            >
                {/* Superposición oscura y blur */}
                <div className="absolute inset-0 bg-black bg-opacity-65 backdrop-blur-sm -z-10"></div>
            </div>
        </>
    )
}
