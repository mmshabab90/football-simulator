import DS from 'ember-data';
import { computed } from '@ember/object';
import { union, filterBy, mapBy, sum } from '@ember/object/computed';

export default DS.Model.extend({
    name: DS.attr('string'),
    homeGames: DS.hasMany('game', { inverse: 'homeTeam' }),
    awayGames: DS.hasMany('game', { inverse: 'awayTeam' }),

    gamesPlayed: union('homeGames', 'awayGames'),

    // game wins
    homeGamesWon: filterBy('homeGames', 'isHomeWin'),
    awayGamesWon: filterBy('awayGames', 'isAwayWin'),
    gamesWon: union('homeGamesWon', 'awayGamesWon'),

    // game lost
    homeGamesLost: filterBy('homeGames', 'isAwayWin'),
    awayGamesLost: filterBy('awayGames', 'isHomeWin'),
    gamesLost: union('homeGamesLost', 'awayGamesLost'),

    // games drawn
    gamesDrawn: filterBy('gamesPlayed', 'isDraw'),

    // goals scored
    homeGoalsScoredArray: mapBy('homeGames', 'homeGoals'),
    homeGoalsScored: sum('homeGoalsScoredArray'),
    awayGoalsScoredArray: mapBy('awayGames', 'awayGoals'),
    awayGoalsScored: sum('awayGoalsScoredArray'),
    goalScored: computed('homeGoalsScored', 'awayGoalsScored', function() {
        return  this.homeGoalsScored + this.awayGoalsScored;
    }),

    // goals conceded
    homeConcedeArray: mapBy('homeGames', 'awayGoals'),
    homeGoalsConceded: sum('homeConcedeArray'),
    awayGoalsConcededArray: mapBy('awayGames', 'homeGoals'),
    awayGoalsConceded: sum('awayGoalsConcededArray'),
    goalConceded: computed('homeGoalsConceded', 'awayGoalsConceded', function() {
        return  this.homeGoalsConceded + this.awayGoalsConceded;
    }),

    // goal difference
    goalDifference: computed('goalScored', 'goalConceded', function() {
        return this.goalScored - this.goalConceded;
    }),

    // 3 points for each game won and 1 point for each game drawn
    points: computed('gamesWon.length', 'gamesDrawn.length', function() {
        return (this.gamesWon.length * 3) + this.gamesDrawn.length; 
    }),
});
