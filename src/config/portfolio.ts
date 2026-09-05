export type PortfolioCategory="web"|"applications"|"video"|"it";export type PublicPortfolioItem={id:string;title:string;category:PortfolioCategory;summary:string;image:string;publicLabel:"Projet interne"|"Produit DigIT"|"Client public vérifié";href?:string;video?:string};
// Une entrée ne doit être ajoutée qu'avec un asset public et un statut de publication vérifiés.
export const publicPortfolio:readonly PublicPortfolioItem[]=[];
