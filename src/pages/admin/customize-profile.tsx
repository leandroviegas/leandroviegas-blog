import React, { useEffect, useState } from 'react';

import AdminLayout from "@layouts/AdminLayout";
import Head from "@components/Head";
import FloatingLabelInput from '@components/Inputs/FloatingLabelInput';

import linkfy from '@utils/linkfy';
import api from '@services/api';
import { useAuth } from '@hooks/Auth';

const Index = () => {
    const [form, setForm] = useState<{
        link: string,
        username: string,
        about: string,
        linkedin: string,
        github: string,
        profilePicture: string,
        role: string
    }>({ link: "", username: "", about: "", linkedin: "", github: "", profilePicture: "", role: "" });

    const [formStatus, setFormStatus] = useState<"loading" | "success" | "error" | "input-warnings" | "">("")

    const [alerts, setAlerts] = useState<{ [key: string]: string[] }>({})

    const { user, cookies } = useAuth();

    useEffect(() => {
        if (user?._id)
            api.get("/users", { params: { _id: user._id } }).then(resp => {
                setForm(form => ({ ...form, ...resp.data.user }));
            }).catch(err => {
                console.error(err)
            })
    }, [user])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (Object.keys(alerts).some(key => alerts[key].length > 0)) {
            setFormStatus("input-warnings")
            return;
        }

        try {
            const headers = { authorization: `Bearer ${cookies.authentication}` }
            await api.put('/users', form, { headers });
            // Success message or redirect to a different page
        } catch (error) {
            // Error handling
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        setAlerts({
            link: [],
            username: [],
            about: [],
            linkedin: [],
            github: [],
            role: []
        })

        if (form.link?.trim() === '') {
            setAlerts((alerts) => ({ ...alerts, link: ['Link é obrigatório'] }))
        }
        if (form.username?.trim() === '') {
            setAlerts((alerts) => ({ ...alerts, username: ['Nome do usuário é obrigatório'] }))
        } else if (form.username?.trim().length < 3) {
            setAlerts((alerts) => ({ ...alerts, username: ['Nome do usuário deve ter pelo menos 3 caracteres'] }))
        }
    }, [form])

    return (
        <AdminLayout>
            <Head title={`Customizar perfil`} />
            <div className="container">
                <div className="bg-white rounded-lg p-4 mx-4 my-8 shadow-lg">
                    <h1 className='text-2xl font-semibold text-zinc-700'>Customizar perfil</h1>
                    <hr className='my-3' />
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label="Link"
                                    name="link"
                                    value={form.link}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["link"]?.length > 0) ? "error" : "info"} messages={alerts["link"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label='Nome do usuário'
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["username"]?.length > 0) ? "error" : "info"} messages={alerts["username"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="textarea"
                                    label="Sobre"
                                    name="about"
                                    value={form.about}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["about"]?.length > 0) ? "error" : "info"} messages={alerts["about"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label="LinkedIn"
                                    name="linkedin"
                                    value={form.linkedin}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["linkedin"]?.length > 0) ? "error" : "info"} messages={alerts["linkedin"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label="Github"
                                    name="github"
                                    value={form.github}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["github"]?.length > 0) ? "error" : "info"} messages={alerts["github"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label="Foto de perfil"
                                    name="profilePicture"
                                    value={form.profilePicture}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["profilePicture"]?.length > 0) ? "error" : "info"} messages={alerts["profilePicture"]} 
                                />
                            </div>
                            <div className="w-full my-5">
                                <FloatingLabelInput
                                    type="text"
                                    label="Role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    status={(formStatus === "input-warnings" && alerts["role"]?.length > 0) ? "error" : "info"} messages={alerts["role"]} 
                                />
                            </div>
                            <button type="submit">Salvar Informações</button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Index