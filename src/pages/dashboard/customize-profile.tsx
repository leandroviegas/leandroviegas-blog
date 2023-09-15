import React, { useEffect, useState } from 'react';

import DashboardLayout from "@layouts/DashboardLayout";
import Head from "@components/Head";
import FloatingLabelInput from '@components/Inputs/FloatingLabelInput';

import linkfy from '@utils/linkfy';
import api from '@services/api';
import { useAuth } from '@hooks/Auth';
import { User } from '@classes/blog';
import Alert from '@components/Alert';
import { BiUpload } from 'react-icons/bi';

const Index = () => {
    const [initialForm, setInitialForm] = useState<User & { profilePictureFile: { file: File, preview: string } }>({ link: "", active: true, email: "", username: "", about: "", linkedin: "", github: "", profilePicture: "", role: "", ocupation: "", profilePictureFile: { file: null, preview: "" } });
    const [form, setForm] = useState<User & { profilePictureFile: { file: File, preview: string } }>(initialForm);

    const [formStatus, setFormStatus] = useState<"loading" | "success" | "error" | "input-warnings" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const { user, cookies } = useAuth();

    const HandleLoadUser = () => {
        if (user?._id)
            api.get("/users", { params: { _id: user._id } }).then(resp => {
                setInitialForm({ ...resp.data.user, profilePictureFile: { file: null, preview: "" } });
                setForm({ ...resp.data.user, profilePictureFile: { file: null, preview: "" } });
            }).catch(err => {
                console.error(err)
                setAlerts({ ...alerts, "form-error": [err?.response?.data?.message || `Ocorreu um erro ao carregar informações do usuário`] })
            })
    }

    useEffect(() => {
        HandleLoadUser();
    }, [user])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setAlerts({ ...alerts, "form-error": [] })

        if (Object.keys(alerts).some(key => key.startsWith("form-input") && key.endsWith("-warnings") && alerts[key].length > 0)) {
            setFormStatus("input-warnings")
            return;
        }

        const headers = { authorization: `Bearer ${cookies.authentication}`}

        const sendForm = new FormData()
        sendForm.append("_id", form._id)
        sendForm.append("username", form.username)
        sendForm.append("email", form.email)
        sendForm.append("about", form.about)
        sendForm.append("link", form.link)
        sendForm.append("linkedin", form.linkedin)
        sendForm.append("github", form.github)
        sendForm.append("ocupation", form.ocupation)
        sendForm.append("role", form.role)
        sendForm.append("profilePicture", form.profilePicture)
        sendForm.append("profilePictureFile", form.profilePictureFile.file)
        
        await api.put('/users', sendForm, { headers }).then((resp) => {
            HandleLoadUser();
            setAlerts({ ...alerts, "form-success": [resp.data?.message || `Informações de usuário alteradas com sucesso`] })
        }).catch(err => {
            console.error(err.response.data)
            setAlerts({ ...alerts, "form-error": [err?.response?.data?.message || `Ocorreu um erro ao salvar informações do usuário`] })
        });
    };

    const HandleChangeProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0)
            setForm({ ...form, profilePictureFile: { file: event.target.files[0], preview: URL.createObjectURL(event.target.files[0]) } })
    }

    const HandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'link')
            setForm(prevState => ({
                ...prevState,
                [name]: linkfy(value)
            }));
        else
            setForm(prevState => ({
                ...prevState,
                [name]: value
            }));
    };

    useEffect(() => {
        setFormStatus('');

        if (JSON.stringify(form) !== JSON.stringify(initialForm)) {
            setAlerts({
                ...alerts,
                "form-success": [],
            })
        }

        setAlerts(alerts => ({
            ...alerts,
            "form-input-link-warnings": [],
            "form-input-username-warnings": [],
            "form-input-about-warnings": [],
            "form-input-email-warnings": [],
            "form-input-linkedin-warnings": [],
            "form-input-github-warnings": [],
            "form-input-role-warnings": []
        }))

        if (form.link?.trim() === '') {
            setAlerts((alerts) => ({ ...alerts, "form-input-link-warnings": ['Identificação de usuário é obrigatório'] }))
        } else if (form.link?.trim().length < 3) {
            setAlerts((alerts) => ({ ...alerts, "form-input-link-warnings": ['Identificação de usuário deve ter pelo menos 3 caracteres'] }))
        }

        if (form.username?.trim() === '') {
            setAlerts((alerts) => ({ ...alerts, "form-input-username-warnings": ['Nome de usuário é obrigatório'] }))
        } else if (form.username?.trim().length < 3) {
            setAlerts((alerts) => ({ ...alerts, "form-input-username-warnings": ['Nome de usuário deve ter pelo menos 3 caracteres'] }))
        }
    }, [form, initialForm])

    return (
        <DashboardLayout>
            <Head title={`Customizar perfil`} />
            <div className="container">
                <div className="bg-white rounded-lg p-4 mx-4 my-8 shadow-lg">
                    <h1 className='text-2xl font-bold text-zinc-700'>Customizar perfil</h1>
                    <hr className='my-3' />
                    {alerts["form-success"]?.map((message, index) => <Alert key={index} message={message} type="success" />)}
                    {alerts["form-error"]?.map((message, index) => <Alert key={index} message={message} type="error" />)}
                    <div>
                        <form className='grid grid-cols-1 md:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                            <div>
                                <div className="w-full mb-5 mt-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label='Nome do usuário'
                                        name="username"
                                        value={form.username}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-username-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-username-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Identificação de usuário"
                                        name="link"
                                        value={form.link}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-link-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-link-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Email"
                                        name="email"
                                        value={form.email}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-email-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-email-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="textarea"
                                        label="Sobre"
                                        name="about"
                                        value={form.about}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-about-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-about-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Permissões"
                                        name="role"
                                        readOnly={true}
                                        value={form.role}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-role-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-role-warnings"]}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="w-full mt-3">
                                    <div className='flex items-center justify-center'>
                                        <label htmlFor="profilePicture" className='relative cursor-pointer'>
                                            <div className='absolute right-0 z-10'><div className='bg-white p-2 rounded-full shadow-lg'><BiUpload /></div></div>
                                            <img src={form.profilePictureFile.preview || form?.profilePicture || "https://via.placeholder.com/150"} alt={`${form?.username} Profile Picture`}
                                                className="object-cover relative w-24 h-24 mx-auto rounded-full shadow-xl mb-4" />
                                            <input type="file" onClick={(evt) => evt.currentTarget.value = null} onChange={HandleChangeProfilePicture} className='hidden' accept='image/*' id="profilePicture" name="profilePicture" />
                                        </label>
                                    </div>
                                    <div className='flex items-center justify-center flex-wrap gap-2 grow'>
                                        <div onClick={() => setForm({ ...form, profilePicture: "", profilePictureFile: { file: null, preview: "" } })} className='text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer'>Remover imagem</div>
                                        <div onClick={() => setForm({ ...form, profilePicture: initialForm.profilePicture, profilePictureFile: { file: null, preview: "" } })} className='text-sm bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded cursor-pointer'>Imagem anterior</div>
                                    </div>
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Profissão"
                                        name="ocupation"
                                        value={form.ocupation}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-ocupation-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-ocupation-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="LinkedIn"
                                        name="linkedin"
                                        value={form.linkedin}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-linkedin-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-linkedin-warnings"]}
                                    />
                                </div>
                                <div className="w-full my-5">
                                    <FloatingLabelInput
                                        type="text"
                                        label="Github"
                                        name="github"
                                        value={form.github}
                                        onChange={HandleChange}
                                        status={(formStatus === "input-warnings" && alerts["form-input-github-warnings"]?.length > 0) ? "error" : "info"} messages={alerts["form-input-github-warnings"]}
                                    />
                                </div>
                            </div>
                            {JSON.stringify(form) === JSON.stringify(initialForm) ?
                                <div className='bg-zinc-400 text-white font-bold py-2 px-4 rounded text-center'>Salvar Informações</div> :
                                <button type="submit" className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>Salvar Informações</button>}
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Index