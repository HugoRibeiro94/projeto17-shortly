--
-- PostgreSQL database dump
--

-- Dumped from database version 12.16 (Ubuntu 12.16-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 15.4

-- Started on 2023-10-02 17:51:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 65536)
-- Name: counts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.counts (
    id integer NOT NULL,
    "urlID" integer,
    "userID" integer,
    "visitCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone
);


--
-- TOC entry 203 (class 1259 OID 65540)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userID" integer,
    token text NOT NULL,
    "createdAt" timestamp without time zone
);


--
-- TOC entry 204 (class 1259 OID 65546)
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    "userID" integer,
    "shortUrl" text,
    url text,
    "createdAt" timestamp without time zone
);


--
-- TOC entry 205 (class 1259 OID 65552)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp without time zone
);


-- Completed on 2023-10-02 17:51:29

--
-- PostgreSQL database dump complete
--

