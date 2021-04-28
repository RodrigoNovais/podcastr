import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const formatStringDate = (date: string, formatString: string): string => {
    return format(parseISO(date), formatString, { locale: ptBR });
};
