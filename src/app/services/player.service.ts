import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from "../models/player.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/player`);
  }

  getPlayersWithRank(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/player/rank`);
  }

  addPlayer(player: { score: number; pseudo: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/player`, player);
  }

  updatePlayerScore(id: number, score: number): Observable<void> {
    const formData = new FormData();
    formData.append('score', score.toString());
    return this.http.put<void>(`${this.baseUrl}/player/${id}`, formData);
  }

  deleteAllPlayers(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/player`);
  }
}
