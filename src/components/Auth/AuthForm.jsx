import React from "react";

function AuthForm({ form, handleChange, authFunc, url, header }) {
  return (
    <form class="text-center">
      <div class="mb-3">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          onChange={handleChange}
          text={form.email}
          name="email"
          placeholder="Email"
          value={form.email}
        />
      </div>
      <div class="mb-3">
        <input
          onChange={handleChange}
          type="password"
          text={form.password}
          name="password"
          placeholder="Password"
          value={form.password}
          id="form2Example2"
          className="form-control"
        />
      </div>
      <div class="mb-3">
        <button
          class="btn btn-primary d-block w-100"
          type="submit"
          onClick={authFunc}
        >
          {header}
        </button>
      </div>
      <p>
        <a class="text-muted" href={url}>
          or {url.replace("/", "").toLowerCase()}
        </a>
      </p>
    </form>
  );
}

export default AuthForm;
