(function($) {
	$.fn.grid = function(x, y, p1_color, p2_color, name_p1, name_p2) {

		if (p1_color == p2_color) {
			alert("Les joueurs ne peuvent avoir la même couleurs. Veuillez changer les paramètres à l'appel du plugin.");
			return;
		}	else if(x < 4 || y < 4) {
			alert("Vous devez entrez minimum une grille de 4x4");
			return;
		}

		// Score
		var score1 = 0;
		var score2 = 0;

		class P4 
		{
			constructor(selector)
			{
				this.x = x;
				this.y = y;
				this.p1_color = p1_color;
				this.p2_color = p2_color;
				this.name_p1 = name_p1;
				this.name_p2 = name_p2;
				this.selector = selector;
				this.victoire = false;
	
				this.grid();
				this.game();
				this.checkWin();
				this.displayPlayerColor();
				this.displayButton();
				this.displayScore();
			}
	
			grid() {
				const $jeu = $(this.selector);
	
				for (let lgn = 1; lgn <= this.x; lgn++) {
					const $lgn = $('<div>').addClass('lgn');
					for (let col = 1; col <= this.y; col++) {
						const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);
						$lgn.append($col);
					}
					$jeu.append($lgn);
				}
			}

			game() {
				const $jeu = $(this.selector);
				const that = this;
				this.victoire = false;
				// On cherche la dernière case libre 
				function lastCase(col) {
					const $cells = $(`.col[data-col='${col}']`);
					for (let i = $cells.length-1; i >= 0; i--) {
						const $cell = $($cells[i]);
						if ($cell.hasClass('empty')) {
							return $cell;
						}
					}
					return null;
				}

				$jeu.on('mouseenter', '.col.empty', function() {
					if (that.victoire) return;
					const $col = $(this).data('col');
					const $last = lastCase($col);
					if ($last != null) {
						$last.addClass(`p${that.p1_color}`);
					}
				});

				$jeu.on('mouseleave', '.col', function() {
					$('.col').removeClass(`p${that.p1_color}`);
				});

				$jeu.on('click', '.col.empty', function() {
					if (that.victoire) return;
					const $col = $(this).data('col');
					const $last = lastCase($col);
					$last.addClass(`${that.p1_color}`).removeClass(`empty p${that.p1_color}`).data('player', `${that.p1_color}`);
					const clr = that.p1_color;

					const winner = that.checkWin($last.data('lgn'), $last.data('col'));

					that.p1_color = (that.p1_color === "red") ? that.p2_color : "red";
					$('#tour').text("Joueur " + that.p1_color.toUpperCase() + " a toi !").css({"color": `${that.p1_color}`,"font-size": "20px"});

					$(this).trigger('mouseenter');

					if (winner) {
						$("#winner").text(`Les ${winner} ont gagné la partie`).css("font-size", "3rem");
						$('.col.empty').removeClass('empty');
						if (winner === red) {
							score1++;
							$('.countScore1').text(score1);
						} else if (winner === that.p2_color) {
							score2++;
							$('.countScore2').text(score2);
						}
						return;
					}
				});
			}

			checkWin(lgn, col) {
				const that = this;

				function $getCell(i, j) {
					return $(`.col[data-lgn='${i}'][data-col='${j}']`);
				}

				function checkDirection(direction) {
					let total = 0;
					let i = lgn + direction.i;
					let j = col + direction.j;
					let $next = $getCell(i, j);
					while (i >= 0 && i <= that.x && j >= 0 && j <= that.y && $next.data('player') === that.p1_color) {
						total++;
						i += direction.i;
						j += direction.j;
						$next = $getCell(i, j);
					}
					return total;
				}

				function checkWin(directionA, directionB) {
					const total = 1 + checkDirection(directionA) + checkDirection(directionB);
					if (total >= 4) {
						return that.p1_color;
					} else {
						return null;
					}
				}

				function checkHori() {
					return checkWin({i: 0, j: -1}, {i: 0, j: 1});
				}

				function checkVerti() {
					return checkWin({i: -1, j: 0},{i: 1, j: 0});
				}

				function checkDiag1() {
					return checkWin({i: 1, j: 1},{i: -1, j: -1});
				}

				function checkDiag2() {
					return checkWin({i: 1, j: -1},{i: -1, j: 1});
				}

				return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
			}

			displayPlayerColor() {
				const that = this;

				function displayPlayerColor(player, color, name) {
					$("#p" + player + "").attr("style", "color:" + color).append(name + " (" + color + ")<br>")
				}
				displayPlayerColor('1', that.p1_color, that.name_p1);
				displayPlayerColor('2', that.p2_color, that.name_p2);
			}

			displayButton() {
				function displayButton() {
					/* Affichage des boutons */
					$("#score").append('<a class="btn" id="reset_game">Nouvelle Partie</a>').append("<button id='restart' class='btn'>Recommencer</button>").append("<button id='cancel' class='btn'>Annuler un coup</button>")
				}
				displayButton();
			}

			displayScore() {
				function displayScore(score_a, score_b) {
					$("#score").append('<br><br><div class="score">Score : <span class="countScore1">' + score_a + "</span>" + ' - ' + '<span class="countScore2">' + score_b + '</span></div><br>')
				}
				displayScore(score1, score2);
			}

		}


		$('#game').ready(function () {
			const p4 = new P4('#game');

			$('#restart').on('click', function () {
				confirm('Nouveau tour');
				$('#game').empty();
				$('#winner').empty();
				p4.grid();
			})

			$('#reset_game').on('click', function () {
				var score1 = 0;
				var score2 = 0;
				confirm('Êtes vous sur de vouloir commencer une nouvelle partie ?')
				$('#game').empty();
				$('#winner').empty();
				p4.grid();
				displayScore(score1, score2);
			})
		});
	};
})(jQuery);
