import { useState } from 'react';
import { motion } from 'framer-motion';
import { IMaskInput } from 'react-imask';
import { useForm, Controller } from 'react-hook-form';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
}

export default function MilAmigos() {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('https://rcccuritiba.online/enviar-mil-amigos.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
        }).toString(),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error('Resposta do servidor não é JSON válido');
      }

      console.log('Resposta do servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao enviar o formulário');
      }

      if (responseData.message) {
        setIsSubmitted(true);
        reset();
        setError(null);
      } else {
        throw new Error(responseData.error || 'Erro desconhecido no servidor');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar os dados. Tente novamente.';
      setError(errorMessage);
      console.error('Erro:', err);
    }
  };

  // O restante do componente (JSX) permanece inalterado
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 flex flex-col items-center justify-start py-6 px-4">
      <section className="max-w-3xl w-full text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-decorative bg-gradient-to-r from-green-600 to-blue-950 text-transparent bg-clip-text drop-shadow-md">
          Projeto Mil Amigos
        </h1>
        <div className="space-y-2">
          <p className="text-base sm:text-lg text-gray-200">
            O Projeto Mil Amigos é uma iniciativa de captação de recursos que sustenta as ações evangelizadoras da Renovação Carismática Católica na Arquidiocese de Curitiba.
          </p>
          <p className="text-base sm:text-lg text-gray-200">
            Ao contribuir, você se torna parte desta missão, ajudando a manter e expandir diversos projetos de evangelização.
          </p>
          <p className="text-base sm:text-lg font-serif italic text-green-600">
            Deus abençoe sua generosidade e seu compromisso com o Reino!
          </p>
        </div>
      </section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6"
      >
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-950 mb-4 font-serif">
              Junte-se a Nós
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-blue-950 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  {...register('nome', { required: 'Nome é obrigatório' })}
                  className="mt-1 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-green-600 focus:border-green-600 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="Seu nome completo"
                />
                {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-950 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'E-mail é obrigatório',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'E-mail inválido',
                    },
                  })}
                  className="mt-1 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-green-600 focus:border-green-600 bg-gray-50 text-gray-800 placeholder-gray-400"
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-blue-950 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telefone
                </label>
                <Controller
                  name="telefone"
                  control={control}
                  rules={{
                    required: 'Telefone é obrigatório',
                    pattern: {
                      value: /^\d{2}\s\d{4,5}-\d{4}$/,
                      message: 'Formato: XX XXXXX-XXXX',
                    },
                  }}
                  render={({ field }) => (
                    <IMaskInput
                      {...field}
                      mask="00 00000-0000"
                      unmask={false}
                      onAccept={(value: any) => field.onChange(value)}
                      className="mt-1 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-green-600 focus:border-green-600 bg-gray-50 text-gray-800 placeholder-gray-400"
                      placeholder="XX XXXXX-XXXX"
                    />
                  )}
                />
                {errors.telefone && <p className="text-red-400 text-xs mt-1">{errors.telefone.message}</p>}
              </div>
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-950 to-green-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg shadow-md hover:from-blue-900 hover:to-green-700 transition"
              >
                Enviar Cadastro
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="text-center"
          >
            <div className="bg-gradient-to-br from-blue-950 to-green-600 text-white rounded-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Obrigado por sua Colaboração!</h2>
              <p className="text-xs sm:text-sm italic mb-4">
                Obrigado por se tornar um amigo fiel da RCC CURITIBA. Deus te abençoe!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSubmitted(false)}
                className="px-4 sm:px-6 py-2 bg-white text-blue-950 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
              >
                Voltar
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <section className="max-w-6xl mt-12 w-full px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
          O que sua ajuda torna possível
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Escritório Arquidiocesano",
              description: "Presta serviço aos Grupos de Oração da RCC, organiza eventos e formações. Atua como ponto de contato com a Igreja e administra a associação RCC Curitiba.",
              icon: "M9 12h6m-3-3v6m9-1.5A9 9 0 1112 3a9 9 0 019 9.5z",
              bg: "bg-green-100",
              color: "text-green-600",
              images: ["/escritorio1.png", "/escritorio2.png"],
            },
            {
              title: "Projeto Abraço do Pai",
              description: "Profissionais voluntários oferecem serviços essenciais (advocacia, saúde, estética) a comunidades carentes em finais de semana missionários.",
              icon: "M4 4v5h.582a1.5 1.5 0 011.4 1l.4 1a1.5 1.5 0 001.4 1h3.836a1.5 1.5 0 001.4-1l.4-1a1.5 1.5 0 011.4-1H20V4H4z",
              bg: "bg-yellow-100",
              color: "text-yellow-600",
              images: ["/abracopai1.png", "/abracopai2.png"],
            },
            {
              title: "Eventos de Evangelização",
              description: "São organizados grandes eventos de evangelização abertos ao público para levar o amor de Deus a todos.",
              icon: "M3 10h18M4 6h16M5 14h14",
              bg: "bg-blue-100",
              color: "text-blue-600",
              images: ["/evento1.png", "/evento2.png"],
            },
            {
              title: "Grupos de Oração",
              description: "Mais de 160 grupos espalhados pela arquidiocese, com encontros semanais que fortalecem a fé e levam o Espírito Santo às famílias.",
              icon: "M12 20l9-5-9-5-9 5 9 5z",
              bg: "bg-pink-100",
              color: "text-pink-600",
              images: ["/grupooracao1.png", "/grupooracao2.png"],
            },
            {
              title: "Missões com a Juventude",
              description: "Ações missionárias que mobilizam jovens em atividades de evangelização ativa, despertando o protagonismo juvenil na Igreja.",
              icon: "M13 16h-1v-4H8V9h5V5l7 7-7 7z",
              bg: "bg-purple-100",
              color: "text-purple-600",
              span: "md:col-span-2",
              images: ["/jovens1.png", "/jovens2.png"],
            },
          ].map(({ title, description, icon, bg, color, span, images = [] }, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-2xl shadow-xl p-6 ${bg} ${span ?? ''} transition duration-300 hover:shadow-2xl`}
            >
              <div className="flex items-center gap-4 mb-3">
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className={`${color}`}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
                <h3 className="text-lg font-bold text-blue-950">{title}</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{description}</p>
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Imagem ${i + 1}`}
                    className="w-1/2 h-28 object-cover rounded-xl shadow-md"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}