// Crie uma função auxiliar para gerenciar as referências
import {useEffect, useRef, useState} from "react";

const useGridLoader = () => {
    // Referência para o GridLoader móvel
    const mobileGridRef = useRef<{ getScore: () => number | null }>(null);
    // Referência para o GridLoader desktop
    const desktopGridRef = useRef<{ getScore: () => number | null }>(null);
    // Estado para rastrear qual layout está ativo
    const [isMobile, setIsMobile] = useState(true);

    // Detectar mudanças de layout
    useEffect(() => {
        const checkLayout = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verificar inicialmente
        checkLayout();

        // Adicionar listener para redimensionamento
        window.addEventListener('resize', checkLayout);

        // Limpar listener
        return () => window.removeEventListener('resize', checkLayout);
    }, []);

    // Retorna a referência ativa com base no layout atual
    const getActiveRef = () => {
        return isMobile ? mobileGridRef : desktopGridRef;
    };

    return {
        mobileGridRef,
        desktopGridRef,
        getActiveRef
    };
};

export default useGridLoader;