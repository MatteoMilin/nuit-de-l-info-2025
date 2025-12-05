import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Note {
    key: string;
    frequency: number;
    color: string;
    label: string;
}

interface SequenceEntry {
    id: string;
    noteKey: string;
}

type ExtendedWindow = typeof window & {
    webkitAudioContext?: typeof AudioContext;
};

const notes: Note[] = [
    { key: 'C', frequency: 261.63, color: '#FFFFFF', label: 'Do' },
    { key: 'C#', frequency: 277.18, color: '#000000', label: 'Do#' },
    { key: 'D', frequency: 293.66, color: '#FFFFFF', label: 'Ré' },
    { key: 'D#', frequency: 311.13, color: '#000000', label: 'Ré#' },
    { key: 'E', frequency: 329.63, color: '#FFFFFF', label: 'Mi' },
    { key: 'F', frequency: 349.23, color: '#FFFFFF', label: 'Fa' },
    { key: 'F#', frequency: 369.99, color: '#000000', label: 'Fa#' },
    { key: 'G', frequency: 392.0, color: '#FFFFFF', label: 'Sol' },
    { key: 'G#', frequency: 415.3, color: '#000000', label: 'Sol#' },
    { key: 'A', frequency: 440.0, color: '#FFFFFF', label: 'La' },
    { key: 'A#', frequency: 466.16, color: '#000000', label: 'La#' },
    { key: 'B', frequency: 493.88, color: '#FFFFFF', label: 'Si' },
    { key: 'C2', frequency: 523.25, color: '#FFFFFF', label: 'Do' },
    { key: 'C#2', frequency: 554.37, color: '#000000', label: 'Do#' },
    { key: 'D2', frequency: 587.33, color: '#FFFFFF', label: 'Ré' },
    { key: 'D#2', frequency: 622.25, color: '#000000', label: 'Ré#' },
    { key: 'E2', frequency: 659.25, color: '#FFFFFF', label: 'Mi' },
];

const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#', 'C#2', 'D#2'];

const whiteNotes = notes.filter((note) => !blackKeys.includes(note.key));
const blackNotes = notes.filter((note) => blackKeys.includes(note.key));

const WHITE_KEY_WIDTH = 56;
const WHITE_KEY_HEIGHT = 120;
const BLACK_KEY_WIDTH = 36;
const BLACK_KEY_HEIGHT = 80;

const getBlackKeyLeft = (noteKey: string) => {
    const index = notes.findIndex((note) => note.key === noteKey);
    const precedingWhiteKeys = notes
        .slice(0, index)
        .filter((note) => !blackKeys.includes(note.key)).length;
    return precedingWhiteKeys * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
};

const isTypingInTextField = () => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (!activeElement) {
        return false;
    }

    const tagName = activeElement.tagName;
    return (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
    );
};

const SECRET_SEQUENCE = ['C', 'E', 'G', 'B', 'C2', 'E2'];

export const MusicalLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userSequence, setUserSequence] = useState<SequenceEntry[]>([]);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [lastUsernameUpdate, setLastUsernameUpdate] = useState<number>(0);

    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        document.body.classList.add('body2');
        return () => {
            document.body.classList.remove('body2');
        };
    }, []);

    const handleUsernameChange = (value: string) => {
        const now = Date.now();
        if (now - lastUsernameUpdate < 1000) {
            setUsername('');
            setLastUsernameUpdate(now);
            return;
        }

        setUsername(value);
        setLastUsernameUpdate(now);
    };

    const handleEmailChange = (value: string) => {
        const proceed = window.confirm('Êtes-vous sûr de vouloir modifier votre email ?');
        if (!proceed) {
            return;
        }

        setEmail(value);
    };

    const getAudioContext = useCallback(() => {
        const globalWindow = window as ExtendedWindow;
        const AudioContextConstructor =
            globalWindow.AudioContext ?? globalWindow.webkitAudioContext;
        if (!AudioContextConstructor) {
            return null;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextConstructor();
        }

        return audioContextRef.current;
    }, []);

    const playNote = useCallback(
        (frequency: number, duration: number = 0.3) => {
            const audioContext = getAudioContext();
            if (!audioContext) {
                return;
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + duration
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        },
        [getAudioContext]
    );

    const clearPassword = useCallback(() => {
        setUserSequence([]);
        setCursorPosition(0);
    }, []);

    const canValidate = userSequence.length > 0;

    const generateSequenceId = useCallback((noteKey: string) => {
        if (
            typeof crypto !== 'undefined' &&
            typeof crypto.randomUUID === 'function'
        ) {
            return crypto.randomUUID();
        }
        return `${noteKey}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }, []);

    const handleNoteClick = (note: Note) => {
        playNote(note.frequency);
        setIsPlaying(note.key);

        const newEntry: SequenceEntry = {
            id: generateSequenceId(note.key),
            noteKey: note.key,
        };

        const insertPosition = cursorPosition;
        setUserSequence((prev) => {
            const next = [...prev];
            next.splice(insertPosition, 0, newEntry);
            return next;
        });
        setCursorPosition((prev) => prev + 1);

        setTimeout(() => setIsPlaying(null), 300);
    };

    const checkSequence = () => {
        const isCorrect =
            userSequence.length === SECRET_SEQUENCE.length &&
            userSequence.every(
                (entry, index) => entry.noteKey === SECRET_SEQUENCE[index]
            );

        if (isCorrect) {
            playSuccessSound();
            setTimeout(() => {
                clearPassword();
                navigate('/home');
            }, 800);
        } else {
            setAttempts((prev) => prev + 1);
            playErrorSound();
            setTimeout(() => {
                clearPassword();
            }, 1000);
        }
    };

    const playSuccessSound = useCallback(() => {
        SECRET_SEQUENCE.forEach((noteKey, index) => {
            const note = notes.find((n) => n.key === noteKey);
            if (note) {
                setTimeout(() => playNote(note.frequency, 0.2), index * 150);
            }
        });
    }, [playNote]);

    const playErrorSound = () => {
        playNote(200, 0.5);
    };

    useEffect(() => {
        const context = getAudioContext();
        if (!context) {
            return;
        }

        if (context.state === 'suspended') {
            const handlePointerDown = () => {
                const ctx = getAudioContext();
                if (!ctx) {
                    return;
                }

                if (typeof ctx.resume === 'function') {
                    ctx.resume().catch(() => undefined);
                }

                document.removeEventListener('pointerdown', handlePointerDown);
            };

            document.addEventListener('pointerdown', handlePointerDown);

            return () =>
                document.removeEventListener('pointerdown', handlePointerDown);
        }
    }, [getAudioContext]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (isTypingInTextField()) {
                return;
            }

            if (e.key === 'Enter' && canValidate) {
                checkSequence();
            } else if (e.key === 'Backspace' && cursorPosition > 0) {
                e.preventDefault();
                const newSequence = [...userSequence];
                newSequence.splice(cursorPosition - 1, 1);
                setUserSequence(newSequence);
                setCursorPosition(cursorPosition - 1);
            } else if (e.key === 'ArrowLeft' && cursorPosition > 0) {
                e.preventDefault();
                setCursorPosition(cursorPosition - 1);
            } else if (
                e.key === 'ArrowRight' &&
                cursorPosition < userSequence.length
            ) {
                e.preventDefault();
                setCursorPosition(cursorPosition + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [canValidate, userSequence, cursorPosition]);

    return (
        <main
            className='min-h-screen w-full bg-white px-4 py-12 text-slate-900'
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <div className='mx-auto flex w-full max-w-3xl flex-col gap-8'>
                <header className='text-center space-y-2'>
                    <h1 className='text-4xl font-semibold'>Connexion musicale</h1>
                    <p className='text-sm text-slate-600'>
                        Entre ton identifiant, puis compose ton mot de passe sur le piano.
                    </p>
                </header>

                <section className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-4'>
                        <label
                            htmlFor='username'
                            className='text-sm font-medium text-slate-600'
                        >
                            Identifiant
                        </label>
                        <input
                            id='username'
                            type='text'
                            value={username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            placeholder='Pseudo'
                            autoComplete='username'
                            className='w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200'
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <label
                            htmlFor='email'
                            className='text-sm font-medium text-slate-600'
                        >
                            Adresse e-mail
                        </label>
                        <input
                            id='email'
                            type='email'
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            placeholder='exemple@domain.tld'
                            autoComplete='email'
                            className='w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200'
                        />
                    </div>

                    <div className='flex flex-col gap-3'>
                        <span className='text-sm font-medium text-slate-600'>
                            Mot de passe musical
                        </span>
                        <button
                            type='button'
                            onClick={playSuccessSound}
                            className='self-start rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300'
                        >
                            Indice mot de passe (écouter la mélodie)
                        </button>
                        <div className='min-h-[72px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-5'>
                            {userSequence.length === 0 ? (
                                <p className='text-center text-sm text-slate-500'>
                                    Joue ta mélodie sur le piano pour remplir ton mot de passe.
                                </p>
                            ) : (
                                <div className='flex flex-wrap items-center justify-center gap-4'>
                                    {userSequence.map((entry, index) => (
                                        <div key={entry.id} className='flex items-center gap-2'>
                                            <button
                                                type='button'
                                                className='flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 transition-colors hover:bg-slate-700'
                                                onClick={() => setCursorPosition(index)}
                                            >
                                                <span className='sr-only'>
                                                    Position {index + 1}, note {entry.noteKey}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className='text-xs text-slate-500'>
                            Utilise Backspace pour effacer une note et les flèches pour
                            déplacer le curseur.
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-3'>
                        <button
                            type='button'
                            onClick={checkSequence}
                            disabled={!canValidate}
                            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors sm:flex-none sm:px-6 ${canValidate ? 'bg-sky-600 hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                        >
                            Valider
                        </button>
                    </div>

                    {attempts > 0 && (
                        <p className='rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                            Mot de passe incorrect. Tentatives : {attempts}
                        </p>
                    )}

                    <div className='space-y-3'>
                        <h2 className='text-base font-semibold text-slate-700'>Piano</h2>
                        <p className='text-sm text-slate-600'>
                            Clique sur les touches ci-dessous pour choisir chaque note de ton
                            mot de passe.
                        </p>
                        <div className='relative overflow-x-auto pb-4'>
                            <div
                                className='relative mx-auto'
                                style={{ width: whiteNotes.length * WHITE_KEY_WIDTH }}
                            >
                                <div className='flex' style={{ height: WHITE_KEY_HEIGHT }}>
                                    {whiteNotes.map((note) => {
                                        const isActive = isPlaying === note.key;
                                        return (
                                            <button
                                                type='button'
                                                key={note.key}
                                                onClick={() => handleNoteClick(note)}
                                                className={`relative flex h-full flex-none items-end justify-center rounded-b-lg text-xs font-semibold text-slate-700 transition-transform duration-100 ${isActive ? 'translate-y-0.5 brightness-95' : 'hover:translate-y-0.5 hover:brightness-95'}`}
                                                style={{
                                                    width: WHITE_KEY_WIDTH,
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #000000',
                                                    fontFamily: 'Arial, sans-serif',
                                                    paddingBottom: '12px',
                                                }}
                                            >
                                                {note.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {blackNotes.map((note) => {
                                    const isActive = isPlaying === note.key;
                                    return (
                                        <button
                                            type='button'
                                            key={note.key}
                                            onClick={() => handleNoteClick(note)}
                                            className={`absolute z-10 flex items-end justify-center rounded-b-lg border border-slate-900 bg-slate-900 text-[10px] font-semibold text-white transition-transform duration-100 ${isActive ? 'translate-y-0.5 brightness-110' : 'hover:translate-y-0.5 hover:brightness-110'}`}
                                            style={{
                                                width: BLACK_KEY_WIDTH,
                                                height: BLACK_KEY_HEIGHT,
                                                left: getBlackKeyLeft(note.key),
                                                top: 0,
                                                fontFamily: 'Arial, sans-serif',
                                                paddingBottom: '10px',
                                            }}
                                        >
                                            {note.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='text-sm text-slate-600'>
                            {canValidate ? (
                                <p>
                                    Appuie sur <span className='font-semibold'>Entrée</span> ou
                                    clique sur « Valider » pour tester ta combinaison.
                                </p>
                            ) : (
                                <p>
                                    Commence par une première note pour activer la validation.
                                </p>
                            )}
                            {isPlaying && (
                                <p className='mt-2 text-xs uppercase tracking-wide text-sky-600'>
                                    Note en cours : {isPlaying}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
