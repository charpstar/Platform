--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: comment; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.comment AS ENUM (
    'Order',
    'Model',
    'Product'
);


ALTER TYPE public.comment OWNER TO postgres;

--
-- Name: commentclass; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.commentclass AS ENUM (
    'Comment',
    'Reject',
    'Approve',
    'Done',
    'Info'
);


ALTER TYPE public.commentclass OWNER TO postgres;

--
-- Name: modelstate; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.modelstate AS ENUM (
    'ModelReceived',
    'ModelDev',
    'ModelMissing',
    'ModelReview',
    'ModelRefine',
    'ClientModelReceived',
    'ClientFeedback',
    'Done',
    'Pause',
    'Error',
    'ModelInit'
);


ALTER TYPE public.modelstate OWNER TO postgres;

--
-- Name: orderstate; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orderstate AS ENUM (
    'OrderReceived',
    'OrderReview',
    'OrderMissing',
    'Error',
    'Pause',
    'OrderDev',
    'Done',
    'OrderInit'
);


ALTER TYPE public.orderstate OWNER TO postgres;

--
-- Name: productstate; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.productstate AS ENUM (
    'ProductReceived',
    'ProductDev',
    'ProductMissing',
    'ProductReview',
    'ProductRefine',
    'ClientProductReceived',
    'ClientFeedback',
    'Done',
    'Pause',
    'Error',
    'ProductInit'
);


ALTER TYPE public.productstate OWNER TO postgres;

--
-- Name: usertype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usertype AS ENUM (
    'Client',
    'QA',
    'Modeller',
    'Admin'
);


ALTER TYPE public.usertype OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: androidversions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.androidversions (
    productid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    androidlink character varying NOT NULL
);


ALTER TABLE public.androidversions OWNER TO postgres;

--
-- Name: appleversions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appleversions (
    productid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    ioslink character varying NOT NULL
);


ALTER TABLE public.appleversions OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    commentid integer NOT NULL,
    commenttype public.comment NOT NULL,
    modelid integer,
    productid integer,
    orderid integer,
    userid integer,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    comment character varying NOT NULL,
    internal boolean,
    editcomment timestamp with time zone,
    commentclass public.commentclass DEFAULT 'Comment'::public.commentclass
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_commentid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_commentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_commentid_seq OWNER TO postgres;

--
-- Name: comments_commentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_commentid_seq OWNED BY public.comments.commentid;


--
-- Name: linkdata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.linkdata (
    "time" timestamp with time zone DEFAULT now(),
    endpoint character varying,
    ip character varying,
    useragentstring character varying
);


ALTER TABLE public.linkdata OWNER TO postgres;

--
-- Name: modelfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modelfiles (
    modelid integer,
    "time" timestamp with time zone DEFAULT now(),
    filename character varying,
    userid integer
);


ALTER TABLE public.modelfiles OWNER TO postgres;

--
-- Name: models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.models (
    modelid integer NOT NULL,
    modelowner integer,
    orderid integer,
    name character varying NOT NULL
);


ALTER TABLE public.models OWNER TO postgres;

--
-- Name: models_modelid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.models_modelid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.models_modelid_seq OWNER TO postgres;

--
-- Name: models_modelid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.models_modelid_seq OWNED BY public.models.modelid;


--
-- Name: modelstates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modelstates (
    modelid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    statebefore public.modelstate NOT NULL,
    stateafter public.modelstate NOT NULL
);


ALTER TABLE public.modelstates OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    userid integer,
    "time" timestamp with time zone DEFAULT now(),
    seen boolean DEFAULT false,
    message character varying
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: orderhistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderhistory (
    orderid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    modification character varying NOT NULL
);


ALTER TABLE public.orderhistory OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    orderid integer NOT NULL,
    clientid integer NOT NULL,
    qaowner integer,
    "time" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_orderid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_orderid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_orderid_seq OWNER TO postgres;

--
-- Name: orders_orderid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_orderid_seq OWNED BY public.orders.orderid;


--
-- Name: orderstates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderstates (
    orderid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    statebefore public.orderstate NOT NULL,
    stateafter public.orderstate NOT NULL
);


ALTER TABLE public.orderstates OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    productid integer NOT NULL,
    modelid integer,
    color character varying,
    link character varying NOT NULL,
    broken boolean
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_productid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_productid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_productid_seq OWNER TO postgres;

--
-- Name: products_productid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_productid_seq OWNED BY public.products.productid;


--
-- Name: productstates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productstates (
    productid integer NOT NULL,
    "time" timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    statebefore public.productstate NOT NULL,
    stateafter public.productstate NOT NULL
);


ALTER TABLE public.productstates OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: charpstar
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO charpstar;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    usertype public.usertype NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    active boolean NOT NULL,
    hash character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO postgres;

--
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- Name: comments commentid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN commentid SET DEFAULT nextval('public.comments_commentid_seq'::regclass);


--
-- Name: models modelid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models ALTER COLUMN modelid SET DEFAULT nextval('public.models_modelid_seq'::regclass);


--
-- Name: orders orderid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN orderid SET DEFAULT nextval('public.orders_orderid_seq'::regclass);


--
-- Name: products productid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN productid SET DEFAULT nextval('public.products_productid_seq'::regclass);


--
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- Name: androidversions androidversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.androidversions
    ADD CONSTRAINT androidversions_pkey PRIMARY KEY (productid, "time");


--
-- Name: appleversions appleversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appleversions
    ADD CONSTRAINT appleversions_pkey PRIMARY KEY (productid, "time");


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (modelid);


--
-- Name: modelstates modelstates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelstates
    ADD CONSTRAINT modelstates_pkey PRIMARY KEY (modelid, "time");


--
-- Name: orderhistory orderhistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderhistory
    ADD CONSTRAINT orderhistory_pkey PRIMARY KEY (orderid, "time");


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (orderid);


--
-- Name: orderstates orderstates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderstates
    ADD CONSTRAINT orderstates_pkey PRIMARY KEY (orderid, "time");


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (productid);


--
-- Name: productstates productstates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productstates
    ADD CONSTRAINT productstates_pkey PRIMARY KEY (productid, "time");


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: charpstar
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: charpstar
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: androidversions androidversions_productid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.androidversions
    ADD CONSTRAINT androidversions_productid_fkey FOREIGN KEY (productid) REFERENCES public.products(productid);


--
-- Name: androidversions androidversions_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.androidversions
    ADD CONSTRAINT androidversions_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: appleversions appleversions_productid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appleversions
    ADD CONSTRAINT appleversions_productid_fkey FOREIGN KEY (productid) REFERENCES public.products(productid);


--
-- Name: appleversions appleversions_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appleversions
    ADD CONSTRAINT appleversions_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: comments comments_modelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_modelid_fkey FOREIGN KEY (modelid) REFERENCES public.models(modelid);


--
-- Name: comments comments_orderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(orderid);


--
-- Name: comments comments_productid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_productid_fkey FOREIGN KEY (productid) REFERENCES public.products(productid);


--
-- Name: comments comments_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: modelfiles fk_modelfiles_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelfiles
    ADD CONSTRAINT fk_modelfiles_users FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: modelfiles modelfiles_modelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelfiles
    ADD CONSTRAINT modelfiles_modelid_fkey FOREIGN KEY (modelid) REFERENCES public.models(modelid);


--
-- Name: models models_modelowner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_modelowner_fkey FOREIGN KEY (modelowner) REFERENCES public.users(userid);


--
-- Name: models models_orderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(orderid);


--
-- Name: modelstates modelstates_modelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelstates
    ADD CONSTRAINT modelstates_modelid_fkey FOREIGN KEY (modelid) REFERENCES public.models(modelid);


--
-- Name: modelstates modelstates_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelstates
    ADD CONSTRAINT modelstates_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: notifications notifications_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: orderhistory orderhistory_orderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderhistory
    ADD CONSTRAINT orderhistory_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(orderid);


--
-- Name: orderhistory orderhistory_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderhistory
    ADD CONSTRAINT orderhistory_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: orders orders_clientid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_clientid_fkey FOREIGN KEY (clientid) REFERENCES public.users(userid);


--
-- Name: orders orders_qaowner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_qaowner_fkey FOREIGN KEY (qaowner) REFERENCES public.users(userid);


--
-- Name: orderstates orderstates_orderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderstates
    ADD CONSTRAINT orderstates_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(orderid);


--
-- Name: orderstates orderstates_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderstates
    ADD CONSTRAINT orderstates_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: products products_modelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_modelid_fkey FOREIGN KEY (modelid) REFERENCES public.models(modelid);


--
-- Name: productstates productstates_productid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productstates
    ADD CONSTRAINT productstates_productid_fkey FOREIGN KEY (productid) REFERENCES public.products(productid);


--
-- Name: productstates productstates_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productstates
    ADD CONSTRAINT productstates_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

