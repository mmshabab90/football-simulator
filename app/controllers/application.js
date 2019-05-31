import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

// inject game simulator
export default Controller.extend({
    gameSimulator: service(), 
});
