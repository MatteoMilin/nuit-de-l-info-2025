import { useEffect, useState, useCallback } from "react"

export default function Snake() {
    const SIZE = 15;
    const SPEED = 100;

    const [snake, setSnake] = useState([[7, 7]]);
    const [food, setFood] = useState([3, 3]);
    const [direction, setDirection] = useState([0, 1]);
    const [nextDirection, setNextDirection] = useState([0, 1]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const generateFood = useCallback((currentSnake) => {
        let newFood;
        do {
            newFood = [Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)];
        } while (currentSnake.some(seg => seg[0] === newFood[0] && seg[1] === newFood[1]));
        return newFood;
    }, []);

    const isCollision = (head, body) => {
        return head[0] < 0 || head[0] >= SIZE || head[1] < 0 || head[1] >= SIZE ||
            body.some(seg => seg[0] === head[0] && seg[1] === head[1]);
    };

    const getCellType = useCallback((row, col) => {
        if (snake[0][0] === row && snake[0][1] === col) return 'head';
        if (snake.some(seg => seg[0] === row && seg[1] === col)) return 'body';
        if (food[0] === row && food[1] === col) return 'food';
        return 'empty';
    }, [snake, food]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
            e.preventDefault();

            const moves = {
                ArrowUp: [-1, 0],
                ArrowDown: [1, 0],
                ArrowLeft: [0, -1],
                ArrowRight: [0, 1]
            };

            const newDir = moves[e.key];
            const isOpposite = direction[0] === -newDir[0] && direction[1] === -newDir[1];
            if (!isOpposite) setNextDirection(newDir);
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameOver, direction]);

    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setDirection(nextDirection);

            setSnake(prev => {
                const head = prev[0];
                const newHead = [head[0] + nextDirection[0], head[1] + nextDirection[1]];

                if (isCollision(newHead, prev)) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [newHead, ...prev];

                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setScore(s => s + 1);
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, SPEED);

        return () => clearInterval(interval);
    }, [nextDirection, food, gameOver, generateFood]);

    const resetGame = () => {
        setSnake([[7, 7]]);
        setFood([3, 3]);
        setDirection([0, 1]);
        setNextDirection([0, 1]);
        setGameOver(false);
        setScore(0);
    };

    const styles = {
        container: { fontFamily: '"Courier New", monospace' },
        header: {
            background: '#000',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1)',
            borderRadius: 0
        },
        title: { color: '#0f0', textShadow: '0 0 10px #0f0' },
        score: { color: '#0f0', textShadow: '0 0 8px #0f0' },
        gameOverBox: {
            background: '#000',
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.6)',
            borderRadius: 0
        },
        gameOverText: { color: '#f00', textShadow: '0 0 15px #f00' },
        button: {
            background: '#0f0',
            color: '#000',
            borderColor: '#0f0',
            boxShadow: '0 0 15px #0f0',
            borderRadius: 0
        },
        board: {
            background: '#000',
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.6), inset 0 0 30px rgba(0, 255, 0, 0.05)',
            borderRadius: 0
        },
        head: { background: '#0f0', boxShadow: '0 0 12px #0f0, inset 0 0 8px #0f0', borderRadius: 0 },
        body: { background: '#0a0', boxShadow: '0 0 5px #0a0', borderRadius: 0 },
        food: { background: '#f00', boxShadow: '0 0 12px #f00, inset 0 0 8px #f00', borderRadius: 0 },
        empty: { background: '#000', borderRadius: 0 },
        footer: { color: '#0a0', textShadow: '0 0 5px #0a0' }
    };

    const cellStyles = {
        head: 'border-green-300 animate-pulse',
        body: 'border-green-700',
        food: 'border-red-400 animate-pulse',
        empty: 'border-gray-900'
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-black p-2" style={styles.container}>
            <div className="mb-2 text-center border-4 border-green-500 p-2" style={styles.header}>
                <h1 className="text-3xl font-bold mb-1 tracking-widest" style={styles.title}>
                    ▓▒░ SNAKE ░▒▓
                </h1>
                <div className="text-lg font-bold mb-1" style={styles.title}>═══════════════════</div>
                <div className="text-base font-bold" style={styles.score}>
                    SCORE: {score.toString().padStart(5, '0')}
                </div>

                {gameOver && (
                    <div className="mt-2 border-4 border-red-500 p-2" style={styles.gameOverBox}>
                        <p className="text-xl font-bold mb-2 animate-pulse" style={styles.gameOverText}>
                            ╔══════════════╗<br />║ GAME  OVER ║<br />╚══════════════╝
                        </p>
                        <button onClick={resetGame} className="font-bold py-1 px-4 border-2 tracking-wider rounded-none text-sm" style={styles.button}>
                            ► INSERT COIN ◄
                        </button>
                    </div>
                )}

                {!gameOver && (
                    <div className="mt-1" style={{ color: '#0a0' }}>
                        <p className="text-xs tracking-wide">▲ ▼ ◄ ► ARROW KEYS TO MOVE</p>
                    </div>
                )}
            </div>

            <div className="p-2 border-4 border-green-500" style={styles.board}>
                {Array.from({ length: SIZE }).map((_, row) => (
                    <div key={row} className="flex">
                        {Array.from({ length: SIZE }).map((_, col) => {
                            const type = getCellType(row, col);
                            return (
                                <div key={col} className={`w-6 h-6 border ${cellStyles[type]}`} style={styles[type]} />
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-2 text-xs tracking-widest" style={styles.footer}>
                ┌───────────────────────┐<br />│ ©1976 ARCADE SYSTEMS │<br />└───────────────────────┘
            </div>
        </div>
    );
}