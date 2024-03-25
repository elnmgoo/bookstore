import {Order} from '../../store/orders/models/order';

export class Factuur {
  factuurNr: string;
  factuurDatum: number;
  vervalDatum: number;
  betaalDatum: number;
  orders: Order[];
  kortingBeschrijving: string;
  korting: number;
  kortingPercentageBeschrijving: string;
  kortingPercentage: number;
  totaalPrijs: number;
}
