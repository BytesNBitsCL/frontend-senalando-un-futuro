import { Suspense } from 'react'
import { getParamsTitle } from '@/services/actions.services'
import { getWordsFrom } from '@/services/words.service'
import ResponsiveComponents from './components/responsive-components'

export default async function WordsPage({ params }: any) {
  // Obtener los datos de nivel, categoría y palabras
  const level = await getParamsTitle(params.idNivel, 'level');
  const cat = await getParamsTitle(params.idCategoria, 'category');
  const words = await getWordsFrom(cat.idTitle);
  const palabra = await getParamsTitle(params.idPalabras, 'words');

  // Obtener el índice de la palabra en el array de palabras
  const currentWordIndex = words.findIndex((word: any) => word.idPalabra === palabra.idTitle);
  const currentWord = words.find((word: any) => word.idPalabra === palabra.idTitle);

  return (
    <div className="relative flex h-full w-full">
      <div className='flex flex-col items-center gap-10 flex-grow'>
        {/* Palabras */}
        <div>
          <h2 className='text-5xl mt-10 md:text-6xl lg:text-7xl font-medium text-defaultTextColor capitalize'>{palabra.nameTitle}</h2>
        </div>
        <Suspense>
          <ResponsiveComponents level={level} category={cat} word={currentWord} words={words} currentWordIndex={currentWordIndex} />
        </Suspense>
      </div>
    </div>
  );
}
