'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import { ProgressCircle } from '@/app/(protected)/niveles/components/progress-circle'
import { CardContent } from '@/app/(protected)/niveles/components/content-card'
import { useLevelData } from '@/app/(protected)/niveles/components/use-level'
import SimpleLoading from './simpleLoading'
import { PalabraProgreso, UserProgress } from '@/interfaces/levelinterface'

interface HoverCardProps {
    levelId: number
    link?: string
    bloqueado: boolean; // Nueva propiedad añadida
    userProgress : UserProgress  
}

export function HoverCard({ levelId, link, bloqueado, userProgress }: HoverCardProps) { 
    const [isHovered, setIsHovered] = useState(false)
    const { levelData, isLoading, error } = useLevelData(levelId, userProgress)
    const [levelProgress, setLevelProgress] = useState(0)
    
    const calculateProgress = async () => {
        try {
            const levelWordsResponse = await fetch(`/api/words/getAllWordsFromLevel/${levelId}`, {
                method: "GET",
                cache: 'no-cache'
            });
            if (!levelWordsResponse.ok) {
                throw new Error('Failed to fetch words');
            };
            const levelWords = await levelWordsResponse.json();

            const userWords = Object.values(userProgress.palabrasProgreso)
                .filter((palabraProgreso: PalabraProgreso) => {
                    return palabraProgreso.nivelPalabra === levelId
            }).length;
            const porcentajeTotal = Math.round(100 * (userWords / levelWords.length));
            setLevelProgress(porcentajeTotal);
        } catch (error) {
            console.error("Error al actualizar el progreso:", error);
        }
    };

    useEffect(() => {
        calculateProgress();
    }, []);

    if (isLoading) {
        return <SimpleLoading />
    }

    if (error || !levelData || !userProgress) {
        return <div className="w-full md:w-1/3 p-4 text-red-500" aria-live="assertive">{error || 'Error desconocido'}</div>
    }

    const isLocked = bloqueado; // Utiliza la prop bloqueado directamente
    const colorClasses = getColorClasses(levelData.statusNivel, isLocked)

    const cardContent = (
        <Card 
        className={`relative flex flex-col items-center justify-between border-8 p-6 h-96 sm:h-[28rem] md:h-[32rem] lg:h-[31rem] w-full overflow-hidden cursor-pointer transition-all duration-300 ease-in-out
        ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hover}
        ${isHovered ? 'shadow-lg transform -translate-y-8' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <ProgressCircle 
            progress={levelProgress}
            colorClasses={colorClasses}
            isLocked={isLocked}
        />
        <CardContent 
            levelData={levelData}
            isHovered={isHovered}
            isLocked={isLocked}
        />
        </Card>
    )

    return isLocked ? (
        <div className="w-full md:w-1/3">
        {cardContent}
        </div>
    ) : link ? (
        <Link href={link} className="w-full md:w-1/3">
        {cardContent}
        </Link>
    ) : (
        <div className="w-full md:w-1/3">
        {cardContent}
        </div>
    )
}

function getColorClasses(status: number, isLocked: boolean) {
    if (isLocked) {
        return {
            border: 'border-gray-400',
            bg: 'bg-gray-200',
            hover: 'hover:bg-gray-300',
            progress: '#6b7280',
            trailColor: '#d1d5db'
        }
    }
    switch (status) {
        case 1:
        return {
            border: 'border-primary',
            bg: 'bg-primary-50',
            hover: 'hover:bg-primary-50',
            progress: 'hsl(var(--primary))',
            trailColor: 'hsl(var(--primary) / 0.2)'
        }
        case 2:
        return {
            border: 'border-secondary',
            bg: 'bg-secondary-50',
            hover: 'hover:bg-secondary-50',
            progress: 'hsl(var(--secondary))',
            trailColor: 'hsl(var(--secondary) / 0.2)'
        }
        case 3:
        return {
            border: 'border-destructive',
            bg: 'bg-destructive-50',
            hover: 'hover:bg-destructive-50',
            progress: 'hsl(var(--destructive))',
            trailColor: 'hsl(var(--destructive) / 0.2)'
        }
        default:
        return {
            border: 'border-muted',
            bg: 'bg-muted/10',
            hover: 'hover:bg-muted/20',
            progress: 'hsl(var(--muted))',
            trailColor: 'hsl(var(--muted) / 0.2)'
        }
    }
}
