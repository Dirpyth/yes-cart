/*
 * Copyright 2009- 2016 Denys Pavlov, Igor Azarnyi
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.yes.cart.service.endpoint.impl;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * User: denispavlov
 * Date: 15/05/2020
 * Time: 23:39
 */
@ControllerAdvice
public class ErrorControllerAdvice {

    @ExceptionHandler(AuthenticationException.class)
    public void exceptionAuth(final HttpServletRequest request, final HttpServletResponse response, final Exception exp) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public void exceptionDenied(final HttpServletRequest request, final HttpServletResponse response, final Exception exp) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

}
