--
-- PostgreSQL database dump
--

-- Dumped from database version 13.15 (Postgres.app)
-- Dumped by pg_dump version 16.3

-- Started on 2024-08-01 16:13:05 CST

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 17198)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 655 (class 1247 OID 17258)
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'Pending',
    'Shipped',
    'Delivered',
    'Canceled'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- TOC entry 661 (class 1247 OID 17276)
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'Admin',
    'Customer'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 17241)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "modifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 17345)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "cartId" uuid,
    "productId" uuid
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 17209)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 17267)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    status public.order_status_enum DEFAULT 'Pending'::public.order_status_enum NOT NULL,
    "userId" uuid
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 17251)
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "orderId" uuid,
    "productId" uuid
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 17221)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    "imageUrl" character varying,
    disabled boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "modifiedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 17281)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    role public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 17293)
-- Name: user_liked_products_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_liked_products_product (
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL
);


ALTER TABLE public.user_liked_products_product OWNER TO postgres;

--
-- TOC entry 3344 (class 0 OID 17241)
-- Dependencies: 203
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, "createdAt", "modifiedAt", "userId") FROM stdin;
f3e44126-479d-401b-8704-c6da7d441f5c	2024-07-31 11:38:16.379423	2024-07-31 11:38:16.379423	e85f42ad-d93f-4864-a74b-52150ccaa0b7
\.


--
-- TOC entry 3349 (class 0 OID 17345)
-- Dependencies: 208
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (id, quantity, "cartId", "productId") FROM stdin;
\.


--
-- TOC entry 3342 (class 0 OID 17209)
-- Dependencies: 201
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, "createdAt") FROM stdin;
8c477679-1357-4e27-9f53-6065e4785d6c	Category1	2024-07-30 16:37:59.342795
957eb38a-f9b5-4bc4-a94e-98634c58c5ab	Category2	2024-07-30 16:38:50.264695
\.


--
-- TOC entry 3346 (class 0 OID 17267)
-- Dependencies: 205
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "createdAt", status, "userId") FROM stdin;
f355f5a3-a4f7-4187-b2a1-9a973c8660e0	2024-07-31 11:42:21.159556	Pending	\N
8d9d1ba6-ed87-49f7-97dc-281eb42adc56	2024-07-31 11:52:09.983829	Pending	\N
fdcc7d6d-abaa-4699-8009-860967e34020	2024-07-31 12:04:52.644296	Pending	e85f42ad-d93f-4864-a74b-52150ccaa0b7
\.


--
-- TOC entry 3345 (class 0 OID 17251)
-- Dependencies: 204
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, quantity, "orderId", "productId") FROM stdin;
4ad5cedd-0f20-4397-a90c-535864a6be4b	4	f355f5a3-a4f7-4187-b2a1-9a973c8660e0	389d22ab-da35-4de5-bb73-6d563fa80c78
08dcd89e-cc4d-4aa3-9c12-80d2bf08e5df	2	f355f5a3-a4f7-4187-b2a1-9a973c8660e0	d4fb9917-9e13-4778-a5f8-feb18cdc7a2c
3f05ddff-faa3-4af4-afa0-c0611573c3f9	2	8d9d1ba6-ed87-49f7-97dc-281eb42adc56	389d22ab-da35-4de5-bb73-6d563fa80c78
3ec50df8-04bc-4738-ac80-8832700c0328	2	fdcc7d6d-abaa-4699-8009-860967e34020	2c2ae5c5-fed1-4385-a7ec-199127dac554
\.


--
-- TOC entry 3343 (class 0 OID 17221)
-- Dependencies: 202
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, price, "imageUrl", disabled, "createdAt", "modifiedAt", "categoryId") FROM stdin;
389d22ab-da35-4de5-bb73-6d563fa80c78	Product7Category1	12	\N	f	2024-07-30 17:15:10.171424	2024-07-30 17:15:10.171424	8c477679-1357-4e27-9f53-6065e4785d6c
b9beeafd-8be6-43ad-a5c5-95723a715f12	Product6Category1	12	\N	f	2024-07-30 17:15:12.761882	2024-07-30 17:15:12.761882	8c477679-1357-4e27-9f53-6065e4785d6c
d4fb9917-9e13-4778-a5f8-feb18cdc7a2c	Product5Category1	12	\N	f	2024-07-30 17:15:15.045685	2024-07-30 17:15:15.045685	8c477679-1357-4e27-9f53-6065e4785d6c
ff036ae3-e4c4-43de-9c01-e79363c1f4f8	Product4Category1	12	\N	f	2024-07-30 17:15:17.195907	2024-07-30 17:15:17.195907	8c477679-1357-4e27-9f53-6065e4785d6c
2c2ae5c5-fed1-4385-a7ec-199127dac554	Product3Category1	12	\N	f	2024-07-30 17:15:19.905457	2024-07-30 17:15:19.905457	8c477679-1357-4e27-9f53-6065e4785d6c
257a155c-e4f4-4aa0-9ce9-bf4d6b74ac1f	Product2Category1	12	\N	f	2024-07-30 17:15:21.959016	2024-07-30 17:15:21.959016	8c477679-1357-4e27-9f53-6065e4785d6c
bfffa021-4e95-4f3f-adef-f80ac015864b	Product1Category1	12	\N	f	2024-07-30 17:15:24.194982	2024-07-30 17:15:24.194982	8c477679-1357-4e27-9f53-6065e4785d6c
427c7e7e-6b1c-4e8e-8da2-cdfd8568fce1	Product8Category1	12	https://upload.wikimedia.org/wikipedia/commons/2/26/Tabletennis.jpg	t	2024-07-30 17:15:06.897359	2024-07-31 10:40:51.857787	8c477679-1357-4e27-9f53-6065e4785d6c
\.


--
-- TOC entry 3347 (class 0 OID 17281)
-- Dependencies: 206
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, password, role, "createdAt") FROM stdin;
e85f42ad-d93f-4864-a74b-52150ccaa0b7	Customer1	$2a$10$wBf7dYH4nLizbuQuDhQNtOSRauAD6/oeSv6qmwLbGr9gjEVx2O46a	Customer	2024-07-30 16:33:26.448146
f507ed1d-2e4a-492b-b800-13096a77c9f0	Admin1	$2a$10$tzEc/x6AuIw9PdiC.S6uLejGfOyTHBtAEzZlmMkXy6RUD3jsEH9Sm	Admin	2024-07-30 16:34:34.635352
\.


--
-- TOC entry 3348 (class 0 OID 17293)
-- Dependencies: 207
-- Data for Name: user_liked_products_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_liked_products_product ("userId", "productId") FROM stdin;
e85f42ad-d93f-4864-a74b-52150ccaa0b7	ff036ae3-e4c4-43de-9c01-e79363c1f4f8
e85f42ad-d93f-4864-a74b-52150ccaa0b7	bfffa021-4e95-4f3f-adef-f80ac015864b
\.


--
-- TOC entry 3192 (class 2606 OID 17274)
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- TOC entry 3178 (class 2606 OID 17218)
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 17350)
-- Name: cart_item PK_bd94725aa84f8cf37632bcde997; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY (id);


--
-- TOC entry 3182 (class 2606 OID 17232)
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- TOC entry 3186 (class 2606 OID 17248)
-- Name: cart PK_c524ec48751b9b5bcfbf6e59be7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 17290)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3190 (class 2606 OID 17256)
-- Name: order_item PK_d01158fe15b1ead5c26fd7f4e90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 17297)
-- Name: user_liked_products_product PK_faba4f6b74fdd55bb0b5bded8fe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "PK_faba4f6b74fdd55bb0b5bded8fe" PRIMARY KEY ("userId", "productId");


--
-- TOC entry 3188 (class 2606 OID 17250)
-- Name: cart REL_756f53ab9466eb52a52619ee01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId");


--
-- TOC entry 3184 (class 2606 OID 17234)
-- Name: product UQ_22cc43e9a74d7498546e9a63e77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE (name);


--
-- TOC entry 3180 (class 2606 OID 17220)
-- Name: category UQ_23c05c292c439d77b0de816b500; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE (name);


--
-- TOC entry 3196 (class 2606 OID 17292)
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- TOC entry 3197 (class 1259 OID 17299)
-- Name: IDX_84dc716602dd4662b7c88a078e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_84dc716602dd4662b7c88a078e" ON public.user_liked_products_product USING btree ("productId");


--
-- TOC entry 3198 (class 1259 OID 17298)
-- Name: IDX_c068ed98598f6fcb7a082299c5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c068ed98598f6fcb7a082299c5" ON public.user_liked_products_product USING btree ("userId");


--
-- TOC entry 3210 (class 2606 OID 17351)
-- Name: cart_item FK_29e590514f9941296f3a2440d39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES public.cart(id);


--
-- TOC entry 3205 (class 2606 OID 17320)
-- Name: order_item FK_646bf9ece6f45dbe41c203e06e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- TOC entry 3204 (class 2606 OID 17315)
-- Name: cart FK_756f53ab9466eb52a52619ee019; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3211 (class 2606 OID 17356)
-- Name: cart_item FK_75db0de134fe0f9fe9e4591b7bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- TOC entry 3208 (class 2606 OID 17340)
-- Name: user_liked_products_product FK_84dc716602dd4662b7c88a078e8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "FK_84dc716602dd4662b7c88a078e8" FOREIGN KEY ("productId") REFERENCES public.product(id);


--
-- TOC entry 3206 (class 2606 OID 17325)
-- Name: order_item FK_904370c093ceea4369659a3c810; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- TOC entry 3209 (class 2606 OID 17335)
-- Name: user_liked_products_product FK_c068ed98598f6fcb7a082299c54; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_products_product
    ADD CONSTRAINT "FK_c068ed98598f6fcb7a082299c54" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3207 (class 2606 OID 17330)
-- Name: order FK_caabe91507b3379c7ba73637b84; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3203 (class 2606 OID 17300)
-- Name: product FK_ff0c0301a95e517153df97f6812; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES public.category(id);


--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-08-01 16:13:05 CST

--
-- PostgreSQL database dump complete
--

