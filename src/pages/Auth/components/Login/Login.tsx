import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import AuthCard from "../Card";

import "./styles.scss";

import { saveSessionData } from "utils/auth";
import { makeLogin } from "utils/request";

type FieldValues = {
	username: string;
	password: string;
};

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>();
	const [hasError, setHasError] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const { from } = location.state || { from: { pathname: "/movies" } };

	const onSubmit = (data: FieldValues) => {
		makeLogin(data)
			.then((response) => {
				setHasError(false);
				saveSessionData(response.data);
				navigate(from, { replace: true });
			})
			.catch(() => {
				setHasError(true);
			});
	};

	return (
		<AuthCard title="login">
			{hasError && (
				<div className="alert alert-danger mt-5">
					Usuário ou senha inválidos!
				</div>
			)}
			<form className="login-form" onSubmit={handleSubmit(onSubmit)}>
				<div className="input-bt">
					<input
						type="email"
						className={`input-base ${errors.username ? "is-invalid" : ""}`}
						placeholder="E-mail"
						{...register("username", {
							required: "Campo obrigatório",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Email inválido"
							}
						})}
					/>
					{errors.username && (
						<div className="invalid-feedback d-block">
							{errors.username.message}
						</div>
					)}
				</div>
				<div className="input-bt">
					<input
						type="password"
						className={`input-base ${errors.password ? "is-invalid" : ""}`}
						placeholder="Senha"
						{...register("password", { required: "Campo obrigatório" })}
					/>
					{errors.password && (
						<div className="invalid-feedback d-block">
							{errors.password.message}
						</div>
					)}
				</div>

				<div className="login-submit">
					<button className="btn btn-primary w-100 fw-bold py-3">
						FAZER LOGIN
					</button>
				</div>
			</form>
		</AuthCard>
	);
};

export default Login;
