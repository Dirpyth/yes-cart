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

package org.yes.cart.service.misc;

import java.util.List;
import java.util.Map;

/**
 * User: denispavlov
 * Date: 18/07/2016
 * Time: 09:01
 */
public interface CurrencyService {

    /**
     * Get most appropriate  full currency name.
     *
     * @param currency to char currency code.
     *
     * @return language name
     */
    String resolveCurrencyName(String currency);

    /**
     * Get supported currencies.
     *
     * @return  supported currencies.
     */
    Map<String, String> getCurrencyName();

    /**
     * Get supported currencies list.
     *
     * @return  supported currencies list.
     */
    List<String> getSupportedCurrencies();

    /**
     * Get shop specific supported currencies list.
     *
     * @param shopCode currencies supported by shop instance
     *
     * @return  supported currencies list.
     */
    List<String> getSupportedCurrencies(String shopCode);

}
