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

package org.yes.cart.bulkexport.xml.impl;

import org.yes.cart.bulkexport.xml.XmlExportTuple;
import org.yes.cart.domain.entity.Identifiable;

/**
 * User: denispavlov
 * Date: 26/11/2015
 * Time: 12:07
 */
public class XmlExportTupleImpl implements XmlExportTuple {

    private final Object data;

    public XmlExportTupleImpl(final Object data) {
        this.data = data;
    }

    /** {@inheritDoc} */
    @Override
    public String getSourceId() {
        return data == null ? "NULL" :
                data.getClass().getSimpleName() + ":" + (data instanceof Identifiable ? ((Identifiable) data).getId() : "N/A");
    }

    /** {@inheritDoc} */
    @Override
    public Object getData() {
        return data;
    }

    @Override
    public String toString() {
        if (data != null) {
            return "XmlExportTupleImpl{data="
                    + data.getClass().getSimpleName() + ":"
                    + (data instanceof Identifiable ? ((Identifiable) data).getId() : data)
                    + "}";

        }
        return "XmlExportTupleImpl{data=NULL}";
    }
}
