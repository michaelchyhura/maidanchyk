import Image from "next/image";
import { Container } from "@maidanchyk/ui";
import Link from "next/link";

const faqs = [
  [
    {
      question: "Я знаю майданчик, якого немає на вашому сайті. Що мені робити?",
      answer: (
        <>
          Це дуже гарна новина! Заповніть{" "}
          <Link
            className="font-semibold text-orange-600 hover:text-orange-500"
            href="#"
            target="_blank">
            цю форму
          </Link>{" "}
          та залиште ваші контактні дані, а ми з радістю пригостимо вас кавою
        </>
      ),
    },
  ],
  [
    {
      question: "Чи можна забронювати майданчик через ваш сайт?",
      answer:
        "Ні, наразі це неможливо. Забронювати зал можна зателефонувавши за номером або написавши на електронну адресу, вказану у оголошенні",
    },
  ],
  [
    {
      question: "Скільки коштує розміщення мого залу на вашому сайті?",
      answer: "Цілком безкоштовно",
    },
  ],
];

export function Faqs() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
      id="faq">
      <Image
        alt=""
        className="absolute -top-1/2 left-1/2 max-w-none -translate-y-1/4 translate-x-[-30%]"
        height={946}
        src="/assets/background-faqs.jpg"
        unoptimized
        width={1558}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
            id="faq-title">
            Поширені запитання
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Якщо ви не знайшли відповідь на ваше питання, будь ласка, зверніться до нашої служби
            підтримки, і ми з радістю допоможемо вам
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
