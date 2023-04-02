import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {catchError, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {Player} from "../../models/player.model";
import {of} from "rxjs";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  players: Player[] = [];
  newPlayer = {
    pseudo: '',
    score: 0
  };
  showRank = false;
  selectedPlayerId: number = 0;
  updatedScore: number = 0;
  displayedColumns: string[] = ['pseudo', 'score', 'actions'];

  constructor(private apiService: PlayerService, public dialog: MatDialog) {
  }

  @ViewChild('addPlayerDialog') addPlayerDialog!: TemplateRef<any>;
  @ViewChild('updateScoreDialog') updateScoreDialog!: TemplateRef<any>;

  ngOnInit(): void {
    this.fetchPlayers();
  }

  fetchPlayers() {
    const apiCall = this.showRank
      ? this.apiService.getPlayersWithRank()
      : this.apiService.getPlayers();

    apiCall.subscribe((players) => {
      this.players = players;
    });
  }

  openAddPlayerDialog() {
    const dialogRef = this.dialog.open(this.addPlayerDialog);

    dialogRef.afterClosed().subscribe(() => {
      this.newPlayer.pseudo = '';
      this.newPlayer.score = 0;
    });
  }

  openUpdateScoreDialog(player: any) {
    this.updatedScore = player.score;
    this.selectedPlayerId = player.id;
    const dialogRef = this.dialog.open(this.updateScoreDialog, {data: player});

    dialogRef.afterClosed().subscribe(() => {
      this.updatedScore = 0;
    });
  }

  addPlayer() {
    this.apiService.addPlayer(this.newPlayer).pipe(
      tap(() => this.fetchPlayers()),
      catchError((error) => {
        const errorMessage = error.error.message || `Une erreur s'est produite lors de l'ajout du joueur.`;
        alert(errorMessage);
        return of(null);
      })
    ).subscribe(() => {
      this.newPlayer.pseudo = '';
      this.newPlayer.score = 0;
      this.dialog.closeAll();
    })
  }

  updatePlayerScore(id: number, score: number) {
    this.apiService.updatePlayerScore(id, score).pipe(
      tap(() => {
        this.fetchPlayers();
      })
    ).subscribe(() => {
      this.dialog.closeAll();
    });
  }

  deleteAllPlayers() {
    this.apiService.deleteAllPlayers().pipe(
      tap(() => this.fetchPlayers())
    ).subscribe();
  }

  toggleRank() {
    this.showRank = !this.showRank;
    this.displayedColumns = this.showRank
      ? ['rank', 'pseudo', 'score', 'actions']
      : ['pseudo', 'score', 'actions'];
    this.fetchPlayers();
  }
}
