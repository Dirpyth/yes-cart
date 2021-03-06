/*
 * Copyright 2009 Inspire-Software.com
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

package org.yes.cart.service.async.model.impl;

import org.yes.cart.service.async.JobStatusListener;
import org.yes.cart.service.async.model.AsyncContext;
import org.yes.cart.service.async.model.JobContext;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * User: denispavlov
 * Date: 12-08-05
 * Time: 3:06 PM
 */
public class JobContextImpl implements JobContext {

    private final boolean async;
    private final JobStatusListener listener;
    private final Map<String, Object> attributes = new HashMap<>();

    public JobContextImpl(final boolean async, final JobStatusListener listener) {
        this.async = async;
        this.listener = listener;
        if (this.async) {
            this.attributes.put(AsyncContext.ASYNC, AsyncContext.ASYNC);
        }
    }

    public JobContextImpl(final boolean async, final JobStatusListener listener, final Map<String, Object> attributes) {
        this.async = async;
        this.listener = listener;
        this.attributes.putAll(attributes);
        if (this.async) {
            this.attributes.put(AsyncContext.ASYNC, AsyncContext.ASYNC);
        } else {
            this.attributes.remove(AsyncContext.ASYNC);
        }
    }

    /** {@inheritDoc} */
    @Override
    public <T> T getAttribute(final String name) {
        if (this.attributes.containsKey(name)) {
            return (T) this.attributes.get(name);
        }
        return null;
    }

    /** {@inheritDoc} */
    @Override
    public Map<String, Object> getAttributes() {
        return Collections.unmodifiableMap(attributes);
    }

    /** {@inheritDoc} */
    @Override
    public JobStatusListener getListener() {
        return listener;
    }

    /** {@inheritDoc} */
    @Override
    public boolean isAsync() {
        return async;
    }
}
