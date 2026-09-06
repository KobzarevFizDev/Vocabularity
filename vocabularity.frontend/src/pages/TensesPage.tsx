import { useState } from "react";
import styles from "./TensesPage.module.css";

type Time = "Present" | "Past" | "Future";
type Kind = "subj" | "be" | "aux" | "verb" | "neg" | "punct";

interface Block {
    text: string;
    kind: Kind;
}

const b = (text: string, kind: Kind): Block => ({ text, kind });
const S = (t: string): Block => b(t, "subj");
const BE = (t: string): Block => b(t, "be");
const AUX = (t: string): Block => b(t, "aux");
const VERB = (t: string): Block => b(t, "verb");
const NOT: Block = b("not", "neg");
const Q: Block = b("?", "punct");

/* Группы местоимений */
const I = "I";
const HE = "He / She / It";
const YOU = "You / We / They";
const IHE = "I / He / She / It";
const IYOU = "I / You / We / They";
const ALL = "I / He / She / It / You / We / They";

interface Tense {
    id: string;
    time: Time;
    aspect: string;
    plus: Block[][];
    minus: Block[][];
    question: Block[][];
}

const TENSES: Tense[] = [
    {
        id: "present-simple", time: "Present", aspect: "Simple",
        plus: [
            [S(IYOU), VERB("V")],
            [S(HE), VERB("V-s")],
        ],
        minus: [
            [S(IYOU), AUX("do"), NOT, VERB("V")],
            [S(HE), AUX("does"), NOT, VERB("V")],
        ],
        question: [
            [AUX("Do"), S(IYOU), VERB("V"), Q],
            [AUX("Does"), S(HE), VERB("V"), Q],
        ],
    },
    {
        id: "present-continuous", time: "Present", aspect: "Continuous",
        plus: [
            [S(I), BE("am"), VERB("V-ing")],
            [S(HE), BE("is"), VERB("V-ing")],
            [S(YOU), BE("are"), VERB("V-ing")],
        ],
        minus: [
            [S(I), BE("am"), NOT, VERB("V-ing")],
            [S(HE), BE("is"), NOT, VERB("V-ing")],
            [S(YOU), BE("are"), NOT, VERB("V-ing")],
        ],
        question: [
            [BE("Am"), S(I), VERB("V-ing"), Q],
            [BE("Is"), S(HE), VERB("V-ing"), Q],
            [BE("Are"), S(YOU), VERB("V-ing"), Q],
        ],
    },
    {
        id: "present-perfect", time: "Present", aspect: "Perfect",
        plus: [
            [S(IYOU), AUX("have"), VERB("V3")],
            [S(HE), AUX("has"), VERB("V3")],
        ],
        minus: [
            [S(IYOU), AUX("have"), NOT, VERB("V3")],
            [S(HE), AUX("has"), NOT, VERB("V3")],
        ],
        question: [
            [AUX("Have"), S(IYOU), VERB("V3"), Q],
            [AUX("Has"), S(HE), VERB("V3"), Q],
        ],
    },
    {
        id: "present-perfect-continuous", time: "Present", aspect: "Perfect Continuous",
        plus: [
            [S(IYOU), AUX("have"), BE("been"), VERB("V-ing")],
            [S(HE), AUX("has"), BE("been"), VERB("V-ing")],
        ],
        minus: [
            [S(IYOU), AUX("have"), NOT, BE("been"), VERB("V-ing")],
            [S(HE), AUX("has"), NOT, BE("been"), VERB("V-ing")],
        ],
        question: [
            [AUX("Have"), S(IYOU), BE("been"), VERB("V-ing"), Q],
            [AUX("Has"), S(HE), BE("been"), VERB("V-ing"), Q],
        ],
    },
    {
        id: "past-simple", time: "Past", aspect: "Simple",
        plus: [[S(ALL), VERB("V2 / V-ed")]],
        minus: [[S(ALL), AUX("did"), NOT, VERB("V")]],
        question: [[AUX("Did"), S(ALL), VERB("V"), Q]],
    },
    {
        id: "past-continuous", time: "Past", aspect: "Continuous",
        plus: [
            [S(IHE), BE("was"), VERB("V-ing")],
            [S(YOU), BE("were"), VERB("V-ing")],
        ],
        minus: [
            [S(IHE), BE("was"), NOT, VERB("V-ing")],
            [S(YOU), BE("were"), NOT, VERB("V-ing")],
        ],
        question: [
            [BE("Was"), S(IHE), VERB("V-ing"), Q],
            [BE("Were"), S(YOU), VERB("V-ing"), Q],
        ],
    },
    {
        id: "past-perfect", time: "Past", aspect: "Perfect",
        plus: [[S(ALL), AUX("had"), VERB("V3")]],
        minus: [[S(ALL), AUX("had"), NOT, VERB("V3")]],
        question: [[AUX("Had"), S(ALL), VERB("V3"), Q]],
    },
    {
        id: "past-perfect-continuous", time: "Past", aspect: "Perfect Continuous",
        plus: [[S(ALL), AUX("had"), BE("been"), VERB("V-ing")]],
        minus: [[S(ALL), AUX("had"), NOT, BE("been"), VERB("V-ing")]],
        question: [[AUX("Had"), S(ALL), BE("been"), VERB("V-ing"), Q]],
    },
    {
        id: "future-simple", time: "Future", aspect: "Simple",
        plus: [[S(ALL), AUX("will"), VERB("V")]],
        minus: [[S(ALL), AUX("will"), NOT, VERB("V")]],
        question: [[AUX("Will"), S(ALL), VERB("V"), Q]],
    },
    {
        id: "future-continuous", time: "Future", aspect: "Continuous",
        plus: [[S(ALL), AUX("will"), BE("be"), VERB("V-ing")]],
        minus: [[S(ALL), AUX("will"), NOT, BE("be"), VERB("V-ing")]],
        question: [[AUX("Will"), S(ALL), BE("be"), VERB("V-ing"), Q]],
    },
    {
        id: "future-perfect", time: "Future", aspect: "Perfect",
        plus: [[S(ALL), AUX("will"), AUX("have"), VERB("V3")]],
        minus: [[S(ALL), AUX("will"), NOT, AUX("have"), VERB("V3")]],
        question: [[AUX("Will"), S(ALL), AUX("have"), VERB("V3"), Q]],
    },
    {
        id: "future-perfect-continuous", time: "Future", aspect: "Perfect Continuous",
        plus: [[S(ALL), AUX("will"), AUX("have"), BE("been"), VERB("V-ing")]],
        minus: [[S(ALL), AUX("will"), NOT, AUX("have"), BE("been"), VERB("V-ing")]],
        question: [[AUX("Will"), S(ALL), AUX("have"), BE("been"), VERB("V-ing"), Q]],
    },
];

const EXAMPLES: Record<string, { plus: string; minus: string; question: string }> = {
    "present-simple": {
        plus: "She works every day.",
        minus: "She does not (doesn't) work on Sundays.",
        question: "Does she work here?",
    },
    "present-continuous": {
        plus: "She is reading now.",
        minus: "They are not (aren't) sleeping.",
        question: "Are you listening to me?",
    },
    "present-perfect": {
        plus: "I have already finished.",
        minus: "He has not (hasn't) called yet.",
        question: "Have you seen this film?",
    },
    "present-perfect-continuous": {
        plus: "She has been working for 2 hours.",
        minus: "I have not been sleeping well lately.",
        question: "How long have you been learning English?",
    },
    "past-simple": {
        plus: "She worked yesterday.",
        minus: "They did not (didn't) come.",
        question: "Did you see him?",
    },
    "past-continuous": {
        plus: "She was watching TV at 5.",
        minus: "We were not (weren't) sleeping.",
        question: "Were you working at 5 o'clock?",
    },
    "past-perfect": {
        plus: "She had left before I arrived.",
        minus: "He had not (hadn't) finished by 6.",
        question: "Had you seen it before?",
    },
    "past-perfect-continuous": {
        plus: "She had been waiting for an hour when he came.",
        minus: "He had not been working long.",
        question: "Had you been waiting long?",
    },
    "future-simple": {
        plus: "She will help you.",
        minus: "I will not (won't) go there.",
        question: "Will you come tomorrow?",
    },
    "future-continuous": {
        plus: "She will be working at 5 tomorrow.",
        minus: "I will not (won't) be sleeping then.",
        question: "Will you be using the car in the evening?",
    },
    "future-perfect": {
        plus: "She will have finished by 8.",
        minus: "He will not (won't) have arrived by then.",
        question: "Will you have completed it by Friday?",
    },
    "future-perfect-continuous": {
        plus: "By June I will have been living here for a year.",
        minus: "She will not have been working here for long by then.",
        question: "Will you have been waiting long?",
    },
};

const TENSE_BY_ID = new Map(TENSES.map(t => [t.id, t]));
const TIME_ORDER: Time[] = ["Present", "Past", "Future"];

const TIME_CLASS: Record<Time, string> = {
    Present: styles.timePresent,
    Past: styles.timePast,
    Future: styles.timeFuture,
};

const KIND_CLASS: Record<Kind, string> = {
    subj: styles.kSubj,
    be: styles.kBe,
    aux: styles.kAux,
    verb: styles.kVerb,
    neg: styles.kNeg,
    punct: styles.kPunct,
};

const FORMS = [
    { key: "plus", sign: "+", label: "Утверждение" },
    { key: "minus", sign: "−", label: "Отрицание" },
    { key: "question", sign: "?", label: "Вопрос" },
] as const;

export default function TensesPage() {
    const [selectedId, setSelectedId] = useState("present-continuous");
    const selected = TENSE_BY_ID.get(selectedId)!;

    return (
        <div className="page">
            <div className={styles.scroll}>
                <header className={styles.intro}>
                    <h1>Формулы времён</h1>
                    <p>Выбери время — увидишь, как строятся + − ? для каждой группы местоимений.</p>
                </header>

                <section className={styles.panel}>
                    <label className={styles.label} htmlFor="tense">Выбери время</label>
                    <select
                        id="tense"
                        className={styles.select}
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                    >
                        {TIME_ORDER.map(time => (
                            <optgroup key={time} label={time}>
                                {TENSES.filter(t => t.time === time).map(t => (
                                    <option key={t.id} value={t.id}>{t.aspect}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    <h2 className={`${styles.tenseName} ${TIME_CLASS[selected.time]}`}>
                        {selected.time} {selected.aspect}
                    </h2>

                    <div className={styles.blocks}>
                        {FORMS.map(({ key, sign, label }) => (
                            <div key={key} className={styles.block}>
                                <div className={styles.blockHead}>
                                    <span className={`${styles.blockSign} ${sign === "+" ? styles.signPlus : sign === "−" ? styles.signMinus : styles.signQues}`}>
                                        {sign}
                                    </span>
                                    <span className={styles.blockLabel}>{label}</span>
                                </div>
                                {selected[key].map((line, i) => (
                                    <div key={i} className={styles.line}>
                                        {line.map((block, j) => (
                                            <span key={j} className={styles.wrap}>
                                                {j > 0 && <span className={styles.plus}>+</span>}
                                                <span className={`${styles.chip} ${KIND_CLASS[block.kind]}`}>{block.text}</span>
                                            </span>
                                        ))}
                                    </div>
                                ))}
                                <div className={styles.example}>{EXAMPLES[selected.id][key]}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={styles.legend}>
                    <span><i className={styles.dotBe} /> to be (am / is / are / was / were / been)</span>
                    <span><i className={styles.dotAux} /> вспомогательный глагол (do / have / will …)</span>
                    <span><i className={styles.dotVerb} /> смысловой глагол (V / V-ing / V3)</span>
                </div>
            </div>
        </div>
    );
}
