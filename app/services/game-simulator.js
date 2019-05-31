import Service from '@ember/service';
import { inject } from '@ember/service';
import { later } from '@ember/runloop';
import { shuffle } from 'ember-composable-helpers/helpers/shuffle';
import { computed } from '@ember/object';

let DELAY_BETWEEN_GAME = 500;

export default Service.extend({

    store: inject(),

    games: computed(function(){
        // return query from store
        return this.store.peekAll('game');
    }),

    teams: computed(function(){
        // return query from store
        return this.store.peekAll('team');
    }),

    init() {
        this._super(...arguments);

        console.log('Game sim...');

        this.seedTeams();

        // simulate game every second
        later(this, this.simulateGame, DELAY_BETWEEN_GAME)
    },

    seedTeams () {
        let teamNames = [
            'Manchester United', 
            'FC Barcelona', 
            'Real Madrid', 
            'Bayern Munich',
            'Manchester City',
            'Arsenal',
            'Chelsea',
            'Liverpool',
            'Juventus',
            'Tottenham Hotspur',
            'Paris Saint-Germain (PSG)',
            'Borussia Dortmund',
            'Atlético de Madrid',
            'West Ham United',
            'Schalke 04',
            'Roma',
            'AC Milan',
            'Internazionale',
            'Leicester City',
            'Napoli',
        ];

        for(let i = 0; i < teamNames.length; i++) {
            this.store.createRecord('team', { id: i, name: teamNames[i] });
        }
    },

    // pick 2 teams at random and create the game
    simulateGame() {

        let  initScore = Math.round(Math.random() * 10)

        let teams = this.store.peekAll('team');

        let shuffleTeams = shuffle(teams);

        let homeTeam = shuffleTeams[0];
        let awayTeam = shuffleTeams[1];

        let homeGoals = this.randomScore(initScore);
        let awayGoals = this.randomScore(initScore);

        this.store.createRecord('game', {
            homeTeam,
            awayTeam,
            homeGoals,
            awayGoals,
            playedOn: new Date()
        });

        // simulate game every second
        later(this, this.simulateGame, DELAY_BETWEEN_GAME)

    },

    // funtion hat creates random scores for a game
    randomScore(maximumGoals) {
        return Math.round((Math.random() * maximumGoals));
    }
});
