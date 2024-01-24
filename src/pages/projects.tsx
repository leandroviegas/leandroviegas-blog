import React from "react";

import Layout from "@layouts/UserLayout";

import SeoHead from "@components/Head";

import TorchImagesThumbnail from "@images/projects_thumbnail/torch-images_thumbnail.webp";
import PersonalBlogThumbnail from "@images/projects_thumbnail/personal-blog_thumbnail.webp";
import RegisterFormThumbnail from "@images/projects_thumbnail/register-form_thumbnail.webp";

import { BiLogoGithub, BiSquare } from "react-icons/bi";
import { MdOutlineWeb } from "react-icons/md";

interface ProjectCardProps {
  title: string;
  description: string;
  Thumbnail: any;
  refers: { [referName: string]: string };
  tags: string[];
}

function ProjectCard({
  title,
  description,
  Thumbnail,
  refers,
  tags,
}: ProjectCardProps) {
  return (
    <div className="col-span-3">
      <div className="md:flex">
        <div className="w-full shrink-0 md:w-60 rounded items-center">
          <img
            className="w-full h-full object-cover px-4 md:px-0"
            src={Thumbnail}
            alt={title + " Thumbnail"}
          />
        </div>
        <div className="grow mx-4 md:w-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 my-1">
            {title}
          </h2>
          <p className="text-gray-700 dark:text-zinc-200 font-thin my-1">
            {description}
          </p>
          <div className="my-1 flex flex-wrap">
            {Object.keys(refers).map((key) => {
              switch (key) {
                case "github":
                  return (
                    <a
                      href={refers[key]}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-white bg-black px-2 py-1 mr-2 rounded"
                    >
                      <BiLogoGithub />
                      <span>Github</span>
                    </a>
                  );
                case "codesandbox":
                  return (
                    <a
                      href={refers[key]}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-white bg-black px-2 py-1 mr-2 rounded whitespace-nowrap"
                    >
                      <BiSquare />
                      <span>CodeSandbox</span>
                    </a>
                  );
                default:
                  return (
                    <a
                      href={refers[key]}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-white bg-black px-2 py-1 mr-2 rounded whitespace-nowrap"
                    >
                      <MdOutlineWeb />
                      <span>Website</span>
                    </a>
                  );
              }
            })}
          </div>
          <div className="py-2 flex flex-wrap">
            {tags.map((item, index) => (
              <span
                key={index}
                className="bg-purple-700 text-white rounded-full px-3 py-1 text-xs my-1 mr-2 whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <hr className="my-6 md:mt-2 md:mb-0 border-gray-400 w-full" />
    </div>
  );
}

export function Head() {
  return (
    <SeoHead
      title="Sobre mim - Leandro Viegas"
      description="Sou desenvolvedor e trabalho com diversas tecnologias"
    />
  );
}

function Index() {
  return (
    <Layout>
      <div className="container grid grid-cols-1 m-auto mx-auto">
        <div className="m-6 rounded-lg">
          <section className="my-12">
            <h1 className="text-2xl mx-2 font-semibold text-zinc-900 dark:text-white">
              Projetos
            </h1>
            <hr className="my-2 border-gray-800 dark:border-gray-200" />
            <div className="md:my-6 mx-2">
              <p className="text-md dark:text-zinc-200 font-thin">
                A aplicação de aprendizados no mundo real é a etapa mais
                importante na jornada de um desenvolvedor.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4 md:pt-0">
              {[
                {
                  title: "Torch Images",
                  description:
                    "Plataforma que reúne diversos bancos de imagens gratuitos em um só lugar.",
                  Thumbnail: TorchImagesThumbnail,
                  refers: {
                    github: "https://github.com/leandroviegas/torch-image",
                    website: "https://torch-images.netlify.app",
                  },
                  tags: [
                    "Next.js",
                    "React.js",
                    "Styled-Components",
                    "Sequelize",
                    "Postgres",
                    "TypeScript",
                    "Next-Auth",
                  ],
                },
                {
                  title: "Blog Pessoal",
                  description:
                    "Blog pessoal para apresentar meu conhecimento pessoal e alguns dos resultados da minha jornada como desenvolvedor.",
                  Thumbnail: PersonalBlogThumbnail,
                  refers: {
                    github: "https://github.com/leandroviegas/personal-blog",
                    website: "https://leandroviegas.netlify.app",
                  },
                  tags: [
                    "Gatsby",
                    "MongoDB",
                    "Express",
                    "React.js",
                    "NodeJS",
                    "Mongoose",
                    "TailwindCSS",
                    "Google Authentication",
                  ],
                },
                {
                  title: "Formulário de cadastro de usuário",
                  description:
                    "Formulário de cadastro com validação de campos sem uso de biblioteca de gerenciamento de formulário.",
                  Thumbnail: RegisterFormThumbnail,
                  refers: {
                    codesandbox:
                      "https://codesandbox.io/s/formulario-cadastro-de-usuario-pd50z8",
                  },
                  tags: [
                    "React JS",
                    "Styled-Components",
                    "MUI components",
                    "JavaScript",
                  ],
                },
              ].map((item, index) => (
                <ProjectCard key={index} {...item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
