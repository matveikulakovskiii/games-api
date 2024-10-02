const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {id: null, name: '', price: null},
            games: [],
            newGame: {name: '', price: null}
        }
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame: async function (id) {

            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInModal = new bootstrap.Modal(document.getElementById('gameInModal'), {});
            gameInModal.show();
        },
        openEditModal: function(game) {

            this.gameInModal = {...game};
            let editGameModal = new bootstrap.Modal(document.getElementById('editGameModal'), {});
            editGameModal.show();
        },
        addGame: async function () {

            const response = await fetch('http://localhost:8080/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.newGame),
            });

            if (response.ok) {
                const addedGame = await response.json();
                this.games.push(addedGame);
                this.newGame = {name: '', price: null};
            }
        },
        deleteGame: async function (id) {

            const response = await fetch(`http://localhost:8080/games/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.games = this.games.filter(game => game.id !== id);
            }
        },
        openAddModal: function(game) {

            this.gameInModal = {...game};
            let addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'), {});
            addGameModal.show();
        },
        updateGame: async function () {

            const response = await fetch(`http://localhost:8080/games/${this.gameInModal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.gameInModal.name,
                    price: this.gameInModal.price,
                }),
            });

            if (response.ok) {

                const updatedGame = await response.json();
                const index = this.games.findIndex(game => game.id === updatedGame.id);
                if (index !== -1) {
                    this.games[index] = updatedGame;
                }


                let editGameModal = bootstrap.Modal.getInstance(document.getElementById('editGameModal'));
                editGameModal.hide();
            }
        }
    }
}).mount('#app');
