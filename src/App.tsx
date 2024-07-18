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

const App = () => {
  interface User {
    name: string;
    image: string;
    followers: number;
  }

  const [players, setPlayers] = useState<User[]>([]);
  const [player1, setPlayer1] = useState<User | null>(null);
  const [player2, setPlayer2] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [length, setLength] = useState(0);

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

  function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function restartGame() {
    const [randomNumber1, randomNumber2] = generateTwoDifferentNumbers(
      1,
      length - 1
    );

    setPlayer1(players[randomNumber1]);
    setPlayer2(players[randomNumber2]);

    setIsModalOpen(false);
    setScore(0);
    setIsClicked(false);
    setHasResult(false);
  }

  function generateTwoDifferentNumbers(min: number, max: number) {
    // Generate the first random number
    const num1: number = getRandomNumber(min, max - 1);

    // Generate the second random number ensuring it's different from the first
    let num2;
    do {
      num2 = getRandomNumber(min, max);
    } while (num1 === num2);

    return [num1, num2];
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

        // Set the initial players
        const [randomNumber1, randomNumber2] = generateTwoDifferentNumbers(
          1,
          length
        );

        setPlayer1(data[randomNumber1]);
        setPlayer2(data[randomNumber2]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the players:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (number1: User, number2: User) => {
    console.log("number1", number1);

    if (number1.followers > number2.followers) {
      setIsRight(true);
    } else if (number1.followers < number2.followers) {
      setIsRight(false);
    }

    setIsClicked(true);

    setTimeout(() => {
      setHasResult(true);
      if (number1.followers > number2.followers) {
        setScore(score + 1);
      }
    }, 3000);

    setTimeout(() => {
      if (number1.followers < number2.followers) {
        setIsModalOpen(true);
      }

      const [randomNumber1, randomNumber2] = generateTwoDifferentNumbers(
        1,
        length - 1
      );

      setPlayer1(players[randomNumber1]);
      setPlayer2(players[randomNumber2]);

      setIsClicked(false);
      setHasResult(false);
    }, 4000);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col md:h-screen justify-center p-4">
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

          <div className="w-full p-6 flex justify-center text-center">
            <Typography
              gutterBottom
              variant="h2"
              component="div"
              className="hidden sm:block md:block lg:block xl:block"
            >
              Who has more followers?
            </Typography>

            <Typography
              gutterBottom
              variant="h4"
              component="div"
              className="sm:hidden"
            >
              Who has more followers?
            </Typography>
          </div>

          <div className="flex w-full  justify-center gap-4">
            <Card className="max-w-40 min-h-44 md:max-w-96">
              <CardActionArea
                onClick={() => {
                  handleClick(player1, player2);
                }}
              >
                <CardMedia
                  component="img"
                  height="210"
                  image={player1 ? player1.image : undefined}
                />
                <CardContent className="flex justify-center text-center flex-col items-center">
                  <Typography gutterBottom variant="h5" component="div">
                    {player1 && player1.name}
                  </Typography>
                  {isClicked && (
                    <Typography variant="h5" color="text.secondary">
                      {player1 && (
                        <CountUp end={player1.followers} duration={3} />
                      )}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
            <Card className="max-w-40 md:max-w-96 min-h-44">
              <CardActionArea
                onClick={() => {
                  handleClick(player2, player1);
                }}
              >
                <CardMedia
                  component="img"
                  height="210"
                  image={player2 ? player2.image : undefined}
                />
                <CardContent className="flex justify-center text-center flex-col items-center">
                  <Typography gutterBottom variant="h5" component="div">
                    {player2 && player2.name}
                  </Typography>
                  {isClicked && (
                    <Typography variant="h5" color="text.secondary">
                      {player2 && (
                        <CountUp end={player2.followers} duration={3} />
                      )}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div className="flex items-center justify-center py-4">
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
                <Typography id="modal-modal-title" variant="h4" component="h2">
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
                <Button onClick={restartGame} variant="contained">
                  Play again
                </Button>
              </Box>
            </Fade>
          </Modal>
        </div>
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
