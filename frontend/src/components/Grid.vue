<template>
  <v-container>
    <v-row>
      <v-col class="text-center" cols="7">
        <v-row class="grid ma-2">
          <li v-for="cell of getCells" :key="cell.cell.value">
            <div class="cell" :class="cell.css.value">
              <div v-if="cell.css.value.includes('north')" />
              <div v-if="cell.css.value.includes('south')" />
              <div v-if="cell.css.value.includes('east')" />
              <div v-if="cell.css.value.includes('west')" />
            </div>
          </li>
        </v-row>
      </v-col>

      <v-col class="text-center" cols="2">
        <!-- ligne 1  -->
        <v-row>
          <v-col>
            <v-btn
              class="ma-2 text-center"
              color="blue darken-2"
              @click="move('north')"
              dark
            >
              <v-icon dark left> mdi-arrow-up </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- ligne 2 -->
        <v-row>
          <v-col>
            <v-btn
              class="ma-2"
              color="blue darken-2"
              @click="move('west')"
              dark
            >
              <v-icon dark left> mdi-arrow-left </v-icon>
            </v-btn>

            <v-btn
              class="ma-2"
              color="blue darken-2"
              @click="move('east')"
              dark
            >
              <v-icon dark left> mdi-arrow-right </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- ligne 3 -->
        <v-row>
          <v-col>
            <v-btn class="" color="blue darken-2" @click="move('south')" dark>
              <v-icon dark left> mdi-arrow-down </v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn @click="reset">Reset</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Grid",
  data: function () {
    return {
      cells: [],
    };
  },
  methods: {
    loadCells() {
      axios
        .get("http://localhost:3000/")
        .then((response) => {
          this.cells = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    move(direction) {
      axios
        .get("http://localhost:3000/move/" + direction)
        .then(() => {
          this.loadCells();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    reset() {
      axios
        .get("http://localhost:3000/reset/")
        .then(() => {
          this.loadCells();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
  },
  computed: {
    getCells() {
      return this.cells;
    },
  },
  created() {
    this.loadCells();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(10, 64px);
  grid-template-rows: repeat(10, 64px);
  list-style: none;
}

.cell {
  width: 64px;
  height: 64px;
  border: solid 1px #494182;
}

.north,
.south,
.east,
.west {
  background: url("../assets/carre.jpeg") center no-repeat;
  display: flex;
  justify-content: center;
}

.north i,
.south i,
.east i,
.west i {
  cursor: pointer;
  font-size: 32px;
  color: #494182;
}

.north i {
  transform: translate(0, 30px);
}

.east i {
  transform: translate(-15px, 15px);
}

.west i {
  transform: translate(15px, 15px);
}

.free {
  background: url("../assets/carre.jpeg") center no-repeat;
  width: 64px;
  height: 64px;
}

.player {
  background: url("../assets/homme.jpeg") center no-repeat;
  background-size: contain;
}

.smallBall {
  background: url("../assets/head.jpeg") center no-repeat;
  background-size: contain;
}

.mediumBall {
  background: url("../assets/body.jpeg") center no-repeat;
  background-size: contain;
}

.bigBall {
  background: url("../assets/foot.jpeg") center no-repeat;
  background-size: contain;
}

.half {
  background: url("../assets/downBody.jpeg") center no-repeat;
  background-size: contain;
}

.snowman {
  background: url("../assets/snowman.jpeg") center no-repeat;
  background-size: contain;
}
</style>
