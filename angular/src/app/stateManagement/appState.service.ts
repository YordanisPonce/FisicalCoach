import { Inject, Injectable } from '@angular/core';
import { Club } from '../_models/club';
import { School } from '../_models/schools';
import { AppStateStore } from './appState.store';
import { GeneralService } from '../_services/general.service';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  constructor(
    private appStateStore: AppStateStore,
    // @ts-ignore
    @Inject('persistStorage') private persistStorage
  ) {}

  clearStore() {
    this.persistStorage.clearStore();
  }

  getTax() {
    return this.appStateStore.getValue().tax;
  }

  setTax(tax: any) {
    this.appStateStore.update((state) => ({
      ...state,
      tax: { ...tax },
    }));
  }

  getGenders() {
    return this.appStateStore.getValue().listGender;
  }

  getPlayers() {
    return this.appStateStore.getValue().players;
  }

  getGendersIdentity() {
    return this.appStateStore.getValue().listGenderIdentity;
  }

  getLateralities() {
    return this.appStateStore.getValue().listLaterality;
  }

  /**
   * create or update school
   * @param school
   */
  updateShool(school: School) {
    this.appStateStore.update((state) => ({
      ...state,
      school: { ...school },
    }));
  }

  /**
   * reset school after select a club
   */
  resetSchool() {
    this.appStateStore.update((state) => ({
      ...state,
      school: null,
    }));
  }

  /**
   * get a school
   * @returns school data
   */
  getSchool() {
    return this.appStateStore.getValue().school;
  }

  /**
   * create or update a club
   * @param club
   */
  updateClub(club: Club) {
    this.appStateStore.update((state) => ({
      ...state,
      club: { ...club },
    }));
  }

  updateClubs(clubs: Club[]) {
    this.appStateStore.update((state) => ({
      ...state,
      clubs: [...clubs],
    }));
  }

  /**
   * get a club
   * @returns club
   */
  getClub() {
    return this.appStateStore.getValue().club;
  }

  getClubs() {
    return this.appStateStore.getValue().clubs;
  }

  /**
   * reset club after select a school
   */
  resetClub() {
    this.appStateStore.update((state) => ({
      ...state,
      club: null,
    }));
  }

  /**
   * reset team or class
   */
  resetTeamOrClass() {
    this.appStateStore.update((state) => ({
      ...state,
      class: null,
      team: null,
    }));
  }

  /**
   * get team details
   * @returns team
   */
  getTeam() {
    return this.appStateStore.getValue().team;
  }

  getPlayerFileId() {
    return this.appStateStore.getValue().player_file_id;
  }

  getPlayer() {
    return this.appStateStore.getValue().player;
  }

  getAlumn() {
    return this.appStateStore.getValue().alumn;
  }

  /**
   * update or create a team
   * @param team
   */
  updateTeam(team: any) {
    this.appStateStore.update((state) => ({
      ...state,
      team: { ...team },
    }));
  }

  /**
   * update a player
   * @param player
   */
  updatePlayer(player: any) {
    const list = Object.assign([], this.getPlayers());
    const index = list.findIndex((x: any) => x.id === player.id);
    if (index >= 0) {
      list[index] = player;
      this.updateListPlayers(list);
    }
    this.appStateStore.update((state) => ({
      ...state,
      player: { ...player },
    }));
  }

  /**
   * update a alumn
   * @param alumn
   */
  updateAlumn(alumn: any) {
    this.appStateStore.update((state) => ({
      ...state,
      alumn: { ...state.alumn, alumn },
    }));
  }

  /**
   * reset alumn
   * @param alumn
   */
  resetAlumn() {
    this.appStateStore.update((state) => ({
      ...state,
      alumn: null,
    }));
  }

  /**
   * update or create a class
   * @param class
   */
  updateClass(shoolClass: any) {
    this.appStateStore.update((state) => ({
      ...state,
      class: { ...shoolClass },
    }));
  }

  /**
   * get class details
   * @returns class
   */
  getClass() {
    return this.appStateStore.getValue().class;
  }

  getCountries() {
    return this.appStateStore.getValue().listCountry;
  }

  getClassroomAcademicYear() {
    return this.getClass()?.active_academic_years?.classroom_academic_year_id;
  }

  setClubEdit(club: any) {
    this.appStateStore.update((state) => ({
      ...state,
      clubEdit: { ...club },
    }));
  }

  setWorkout(workout: any) {
    this.appStateStore.update((state) => ({
      ...state,
      workout: { ...workout },
    }));
  }

  setPlayer(player: any) {
    this.appStateStore.update((state) => ({
      ...state,
      player: { ...player },
    }));
  }

  setAlumn(alumn: any) {
    this.appStateStore.update((state) => ({
      ...state,
      alumn: { ...alumn },
    }));
  }

  updateListCountry(listCountry: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listCountry: [...listCountry],
    }));
  }

  updateListGender(listGender: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listGender: [...listGender],
    }));
  }

  updateListGenderIdentity(listGenderIdentity: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listGenderIdentity: [...listGenderIdentity],
    }));
  }

  updatelistCivilStatus(listCivilStatus: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listCivilStatus: [...listCivilStatus],
    }));
  }

  updateListLaterality(listLaterality: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listLaterality: [...listLaterality],
    }));
  }

  updateListPositions(listPositions: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listPositions: [...listPositions],
    }));
  }

  updateListPlayers(players: any) {
    this.appStateStore.update((state) => ({
      ...state,
      players: [...players],
    }));
  }

  updatePlayerPsychology$(player: any) {
    if (player.isReport) {
      this.appStateStore.update((state) => ({
        ...state,
        playerPsychology: {
          ...state.playerPsychology,
          psychology_reports: state.playerPsychology.psychology_reports.map(
            (report: { id: any }) => {
              if (report.id === player.data.id) {
                return { ...player.data };
              }

              return { ...report };
            }
          ),
        },
      }));
    } else if (player.isDelete) {
      this.appStateStore.update((state) => {
        return {
          ...state,
          playerPsychology: {
            ...state.playerPsychology,
            psychology_reports:
              state.playerPsychology.psychology_reports.filter(
                (report: { id: any }) => report.id !== player.data.id
              ),
          },
        };
      });
    } else {
      this.appStateStore.update((state) => ({
        ...state,
        playerPsychology: { ...player },
      }));
    }
  }

  updateListInjuries(list: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listInjuries: { ...list },
    }));
  }

  updateListAnalizePlayer(list: any) {
    this.appStateStore.update((state) => ({
      ...state,
      listAnalizePlayer: { ...list },
    }));
  }

  updatePlayerFileId(fileid: any) {
    this.appStateStore.update((state) => ({
      ...state,
      player_file_id: fileid,
    }));
  }

  updateUserData(userData: any) {
    this.appStateStore.update((state) => ({
      ...state,
      userData: { ...userData },
    }));
  }

  getUserData() {
    return this.appStateStore.getValue().userData;
  }

  setPlayerToTest(data: any) {
    this.appStateStore.update((state) => ({
      ...state,
      playerToTest: { ...data },
    }));
  }

  getPlayerToTest() {
    return this.appStateStore.getValue().playerToTest;
  }
}
