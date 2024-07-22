import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import CountUp from "react-countup";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Countdown from "react-countdown";
import { useMediaQuery } from "react-responsive";

const App = () => {
  interface Player {
    name: string;
    image: string;
    followers: number;
  }

  const [players, setPlayers] = useState<Player[]>([]);
  const [randomPlayers, setRandomPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [length, setLength] = useState(0);
  const [level, setLevel] = useState(2);

  const isSmall = useMediaQuery({ maxWidth: 767 });
  // const isMedium = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  // const isLarge = useMediaQuery({ minWidth: 1024 });

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    console.log("mudei o level", level);
  }, [level]);

  useEffect(() => {
    const numbers: number[] = generateRandomNumbers(1, 4, level);

    const randomPlayers = numbers.map((number) => players[number]);
    console.log("Tentativa 1", randomPlayers);
    setRandomPlayers(randomPlayers);

    setIsModalOpen(false);
    setIsClicked(false);
    setHasResult(false);
  }, [level, players]);

  function newGame() {
    const numbers: number[] = generateRandomNumbers(1, length - 1, 2);

    const randomPlayers = numbers.map((number) => players[number]);
    setRandomPlayers(randomPlayers);

    setScore(0);
    setLevel(2);
    setIsModalOpen(false);
  }

  function restartGame() {
    const numbers: number[] = generateRandomNumbers(
      1,
      length - 1,
      score >= 2 ? 4 : 2
    );

    const randomPlayers = numbers.map((number) => players[number]);
    console.log("Tentativa 2", randomPlayers);
    setRandomPlayers(randomPlayers);

    setIsModalOpen(false);
    setIsClicked(false);
    setHasResult(false);
  }

  function generateRandomNumbers(
    min: number,
    max: number,
    level: number
  ): number[] {
    if (level > max - min + 1) {
      throw new Error(
        "O valor de level é maior do que o intervalo disponível."
      );
    }

    const numbers = new Set();

    // Gera números aleatórios únicos até o nível desejado
    while (numbers.size < level) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(randomNumber);
    }

    // Converte o Set para um array e retorna
    return Array.from(numbers) as number[];
  }

  useEffect(() => {
    // Fetch the JSON data
    const fetchData = async () => {
      try {
        const response = await fetch("/players.json");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        const length = data.length;
        setLength(length);

        setPlayers(data);

        const numbers: number[] = generateRandomNumbers(1, length - 1, level);

        console.log("numbers", numbers);

        const randomPlayers = numbers.map((number) => data[number]);
        console.log("Tentativa 3", randomPlayers);
        setRandomPlayers(randomPlayers);

        console.log("randomPlayers", randomPlayers);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the players:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (player: Player) => {
    // Encontra o valor máximo da chave 'followers'
    const maxFollowers = Math.max(
      ...randomPlayers.map((player) => player.followers)
    );

    const result = player.followers === maxFollowers;

    setIsRight(result);

    setIsClicked(true);

    setTimeout(() => {
      setHasResult(true);
      if (result) {
        setScore(score + 1);
      }
    }, 3000);

    setTimeout(() => {
      result ? restartGame() : gameOver();
    }, 4000);
  };

  function gameOver() {
    setIsModalOpen(true);

    const numbers: number[] = generateRandomNumbers(
      1,
      players.length - 1,
      level
    );

    const randomPlayers = numbers.map((number) => players[number]);
    setRandomPlayers(randomPlayers);

    setIsClicked(false);
    setHasResult(false);
  }

  const renderer = ({
    seconds,
    completed,
  }: {
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      // Render a completed state when the countdown finishes
      gameOver();
      return <span>Time's up!</span>;
    } else {
      // Render the countdown timer
      return (
        <div className="w-16 h-16 bg-red-500 text-white rounded-[50%] flex items-center justify-center text-lg font-semibold shadow-lg">
          {seconds}
        </div>
      );
    }
  };

  return (
    <div className="background min-h-[100dvh] flex flex-col">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <header>
            <div className="px-4 pt-4 flex justify-center items-center ">
              <img src="/vv_logo.png" width={200} height={200} />
            </div>
          </header>
          <div className="flex flex-grow flex-col h-full items-center justify-center p-4">
            {hasResult && (
              <div
                className={`${
                  isRight ? "bg-lime-400" : "bg-red-400"
                } h-20 w-20 top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full  z-30 absolute flex justify-center items-center`}
              >
                {isRight ? (
                  <CheckIcon fontSize="large" className="text-white" />
                ) : (
                  <CloseIcon fontSize="large" className="text-white" />
                )}
              </div>
            )}

            <div className="w-full p-7 flex flex-col items-center justify-center text-center">
              <div className="flex gap-3">
                <Typography
                  gutterBottom
                  variant={isSmall ? "h4" : "h2"}
                  component="div"
                >
                  Who has more followers?
                </Typography>

                {/* <img src="/instagram_logo.webp" width={20} height={20} /> */}
              </div>

              <Countdown
                date={Date.now() + 20000} // 10 seconds from now
                renderer={renderer}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {randomPlayers.map((player) => {
                return (
                  <Card className="min-h-44 md:w-[300px] transition-transform duration-1000 ease-in-out transform  hover:scale-[102%]">
                    <CardActionArea
                      onClick={() => {
                        handleClick(player);
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="210"
                        image={player ? player.image : undefined}
                      />
                      <CardContent className="flex justify-center text-center flex-col items-center">
                        <Typography gutterBottom variant="h5" component="div">
                          {player && player.name}
                        </Typography>
                        {isClicked && (
                          <Typography variant="h5" color="text.secondary">
                            {player && (
                              <CountUp end={player.followers} duration={3} />
                            )}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </div>
            <div className="flex items-center justify-center py-6">
              <Typography gutterBottom variant="h5" component="div">
                Score: {score}
              </Typography>
            </div>

            <Modal
              open={isModalOpen}
              closeAfterTransition
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Fade in={isModalOpen}>
                <Box
                  className="w-100 rounded-lg flex flex-col justify-center items-center gap-3"
                  sx={style}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h4"
                    component="h2"
                  >
                    Pontuação:
                  </Typography>
                  <Typography
                    className="text-red-500"
                    id="modal-modal-title"
                    variant="h2"
                    component="h2"
                  >
                    {score}
                  </Typography>
                  <Button onClick={newGame} variant="contained">
                    Play again
                  </Button>
                </Box>
              </Fade>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

// {
//   "name": "Morato",
//   "image": "/public/carreras.jpg",
//   "followers": 141000
// },
// {
//   "name": "Beste",
//   "image": "/public/andre_gomes.jpg",
//   "followers": 31900
// },
// {
//   "name": "Jurasek",
//   "image": "/public/jurasek.jpg",
//   "followers": 49200
// }
// {
//   "name": "Florentino",
//   "image": "/public/florentino.jpg",
//   "followers": 293000
// },
// {
//   "name": "João Neves",
//   "image": "/public/joao_neves.jpg",
//   "followers": 418000
// },
// {
//   "name": "João Mário",
//   "image": "/public/joao_mario.jpg",
//   "followers": 681000
// }
// {
//   "name": "Trubin",
//   "image": "/public/trubin.jpg",
//   "followers": 237000
// },
// {
//   "name": "Samuel Soares",
//   "image": "/public/samuel_soares.jpg",
//   "followers": 71100
// },
// {
//   "name": "André Gomes",
//   "image": "/public/andre_gomes.jpg",
//   "followers": 50500
// },
// {
//   "name": "Carreras",
//   "image": "/public/carreras.jpg",
//   "followers": 167000
// },
// {
//   "name": "Otamendi",
//   "image": "/public/otamendi.jpg",
//   "followers": 9000000
// },
// {
//   "name": "António Silva",
//   "image": "/public/antonio_silva.jpg",
//   "followers": 356000
// },
// {
//   "name": "Tomás Araújo",
//   "image": "/public/tomas_araujo.jpg",
//   "followers": 36100
// },
